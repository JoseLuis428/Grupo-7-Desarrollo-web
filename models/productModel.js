const { Op } = require('sequelize');
const db = require('../database/models');

const NOMBRES_CATEGORIAS = {
  cafes: 'Cafés',
  frias: 'Bebidas frías',
  reposteria: 'Repostería',
  alimentos: 'Alimentos'
};

function aPlano(producto) {
  if (!producto) return undefined;
  const p = producto.get({ plain: true });
  return Object.assign({}, p, {
    category: p.category ? p.category.slug : '',
    sizes: p.sizes.map(function (s) { return s.name; })
  });
}

function armarConsulta(filtros) {
  const categoria = { model: db.Category, as: 'category' };
  if (filtros.category) {
    categoria.where = { slug: filtros.category };
    categoria.required = true;
  }

  const consulta = {
    include: [categoria, { model: db.Size, as: 'sizes', through: { attributes: [] } }],
    order: [['id', 'ASC'], [{ model: db.Size, as: 'sizes' }, 'id', 'ASC']]
  };

  if (filtros.q) {
    const patron = '%' + filtros.q + '%';
    consulta.where = {
      [Op.or]: [{ name: { [Op.like]: patron } }, { description: { [Op.like]: patron } }]
    };
  }
  return consulta;
}

async function obtenerCategoria(slug) {
  const nombre = NOMBRES_CATEGORIAS[slug] || slug;
  const [categoria] = await db.Category.findOrCreate({ where: { slug: slug }, defaults: { name: nombre } });
  return categoria;
}

async function obtenerTamanos(nombres) {
  const lista = [];
  for (const nombre of nombres) {
    const [tamano] = await db.Size.findOrCreate({ where: { name: nombre.slice(0, 50) } });
    lista.push(tamano);
  }
  return lista;
}

exports.all = async function (filtros) {
  const productos = await db.Product.findAll(armarConsulta(filtros || {}));
  return productos.map(aPlano);
};

exports.findById = async function (id) {
  const producto = await db.Product.findByPk(Number(id), armarConsulta({}));
  return aPlano(producto);
};

exports.create = async function (datos) {
  const categoria = await obtenerCategoria(datos.category);
  const producto = await db.Product.create({
    name: datos.name,
    description: datos.description,
    image: datos.image,
    price: datos.price,
    categoryId: categoria.id
  });
  await producto.setSizes(await obtenerTamanos(datos.sizes));
  return exports.findById(producto.id);
};

exports.update = async function (id, datos) {
  const producto = await db.Product.findByPk(Number(id));
  if (!producto) return null;

  const categoria = await obtenerCategoria(datos.category);
  await producto.update({
    name: datos.name,
    description: datos.description,
    image: datos.image,
    price: datos.price,
    categoryId: categoria.id
  });
  await producto.setSizes(await obtenerTamanos(datos.sizes));
  return exports.findById(producto.id);
};

exports.remove = async function (id) {
  const eliminados = await db.Product.destroy({ where: { id: Number(id) } });
  return eliminados > 0;
};
