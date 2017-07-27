-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 27-07-2017 a las 05:56:58
-- Versión del servidor: 10.1.24-MariaDB
-- Versión de PHP: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `estacionamiento`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autos`
--

CREATE TABLE `autos` (
  `patente` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `color` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `marca` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `especial` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `autos`
--

INSERT INTO `autos` (`patente`, `color`, `marca`, `especial`) VALUES
('abc123', 'Azul', 'Peugeot', 0),
('abc1234', 'Azul', 'Peugeot', 0),
('abc12345', 'Azul', 'Peugeot', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logusuarios`
--

CREATE TABLE `logusuarios` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `entrada` datetime NOT NULL,
  `token` varchar(528) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `logusuarios`
--

INSERT INTO `logusuarios` (`id`, `idUsuario`, `entrada`, `token`) VALUES
(1, 1, '2017-07-01 13:55:00', '2017-07-02 14:06:00'),
(2, 3, '2017-07-02 14:00:00', '2017-07-03 14:01:00'),
(3, 1, '2017-07-03 14:01:00', '2017-07-03 14:06:00'),
(4, 1, '2017-07-26 19:42:00', ''),
(5, 1, '2017-07-26 23:51:00', ''),
(6, 1, '2017-07-26 23:52:00', ''),
(7, 1, '2017-07-26 23:53:00', ''),
(8, 1, '2017-07-26 23:58:00', ''),
(9, 1, '2017-07-26 23:58:00', ''),
(10, 1, '2017-07-26 23:59:00', ''),
(11, 1, '2017-07-27 00:00:00', ''),
(12, 1, '2017-07-27 00:00:00', ''),
(13, 1, '2017-07-27 00:00:00', ''),
(14, 1, '2017-07-27 00:00:00', ''),
(15, 1, '2017-07-27 00:02:00', ''),
(16, 1, '2017-07-27 00:02:00', ''),
(17, 1, '2017-07-27 00:03:00', ''),
(18, 1, '2017-07-27 00:03:00', ''),
(19, 1, '2017-07-27 00:04:00', ''),
(20, 1, '2017-07-27 00:04:00', ''),
(21, 1, '2017-07-27 00:04:00', ''),
(22, 1, '2017-07-27 00:04:00', ''),
(23, 1, '2017-07-27 00:05:00', ''),
(24, 1, '2017-07-27 00:06:00', ''),
(25, 1, '2017-07-27 00:06:00', ''),
(26, 1, '2017-07-27 00:07:00', ''),
(27, 1, '2017-07-27 00:08:00', ''),
(28, 1, '2017-07-27 00:08:00', ''),
(29, 1, '2017-07-27 00:08:00', ''),
(30, 1, '2017-07-27 00:09:00', ''),
(31, 1, '2017-07-27 00:13:00', ''),
(32, 1, '2017-07-27 00:32:00', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MDExMjYzNDksImV4cCI6MTUwMTE2MjM0OSwiZGF0YSI6eyJpZCI6MSwibWFpbCI6ImFkbWluQGFkbWluIiwibm9tYnJlIjoiR2VybWFuIiwiYXBlbGxpZG8iOiJBZG1pbiIsInBhc3N3b3JkIjoiMTIzIiwiZXN0YWRvIjoxLCJ0dXJubyI6bnVsbCwiYWRtaW4iOjEsImVudHJhZGEiOm51bGwsInBhdGhGb3RvIjpudWxsLCJzYWxpZGEiOm51bGx9LCJhdWQiOiI0YjQ1NWM5YzU5MzQxYjZjNmYxMzI2NDIwNzE3M2QzODI3OWJhMzg1IiwiYXBwIjoiQXBpIFJlc3QgSldUIn0.ojeE3-2m-FAKHEI5N_zz9rtEmOsPBFctJoEXOto79lE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `operaciones`
--

CREATE TABLE `operaciones` (
  `id` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `patente` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `idCochera` int(11) NOT NULL,
  `entrada` datetime NOT NULL,
  `salida` datetime DEFAULT NULL,
  `pago` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `operaciones`
--

INSERT INTO `operaciones` (`id`, `idUser`, `patente`, `idCochera`, `entrada`, `salida`, `pago`) VALUES
(1, 2, 'abc123', 106, '2017-07-03 13:28:00', '2017-07-03 14:30:00', 10),
(2, 1, 'abc1234', 106, '2017-07-03 14:32:00', '2017-07-03 15:36:00', 10),
(3, 1, 'abc12345', 102, '2017-07-02 19:54:00', '2017-07-03 15:40:00', 90);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pisos`
--

CREATE TABLE `pisos` (
  `idPiso` int(11) NOT NULL,
  `cantidadCocheras` int(11) NOT NULL,
  `cantidadReservados` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `pisos`
--

INSERT INTO `pisos` (`idPiso`, `cantidadCocheras`, `cantidadReservados`) VALUES
(1, 4, 3),
(2, 3, 0),
(3, 3, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifas`
--

CREATE TABLE `tarifas` (
  `tiempo` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `valor` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `tarifas`
--

INSERT INTO `tarifas` (`tiempo`, `valor`) VALUES
('estadiaCompleta', 170),
('hora', 10),
('mediaEstadia', 90);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `apellido` varchar(20) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `mail` varchar(30) NOT NULL,
  `password` varchar(60) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `turno` int(11) DEFAULT NULL,
  `pathFoto` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `mail`, `password`, `estado`, `admin`, `turno`, `pathFoto`) VALUES
(1, 'German', 'Admin', 'admin@admin', '123', 1, 1, NULL, NULL),
(3, 'Juan', 'Lopez', 'juan@tarde', '123', 1, 0, 2, 'juan@tarde.png');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autos`
--
ALTER TABLE `autos`
  ADD PRIMARY KEY (`patente`);

--
-- Indices de la tabla `logusuarios`
--
ALTER TABLE `logusuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `operaciones`
--
ALTER TABLE `operaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pisos`
--
ALTER TABLE `pisos`
  ADD PRIMARY KEY (`idPiso`);

--
-- Indices de la tabla `tarifas`
--
ALTER TABLE `tarifas`
  ADD PRIMARY KEY (`tiempo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `logusuarios`
--
ALTER TABLE `logusuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT de la tabla `operaciones`
--
ALTER TABLE `operaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `pisos`
--
ALTER TABLE `pisos`
  MODIFY `idPiso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
