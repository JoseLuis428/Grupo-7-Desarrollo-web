module.exports = function asincrono(funcion) {
  return function (req, res, next) {
    Promise.resolve(funcion(req, res, next)).catch(next);
  };
};
