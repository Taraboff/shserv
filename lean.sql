-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Мар 22 2021 г., 18:32
-- Версия сервера: 10.3.22-MariaDB
-- Версия PHP: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `lean`
--

-- --------------------------------------------------------

--
-- Структура таблицы `current`
--

CREATE TABLE `current` (
  `id` int(11) NOT NULL,
  `dept` int(4) NOT NULL,
  `activestend` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `stends`
--

CREATE TABLE `stends` (
  `id` int(11) NOT NULL,
  `dept` int(4) NOT NULL,
  `version` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `workgroup` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `result5s` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `plan5s` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `best` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `before1` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `after1` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `before2` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `after2` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `params` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `graphics5s` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `projects` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `techcards` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `stends`
--

INSERT INTO `stends` (`id`, `dept`, `version`, `workgroup`, `result5s`, `plan5s`, `best`, `before1`, `after1`, `before2`, `after2`, `params`, `graphics5s`, `projects`, `techcards`) VALUES
(1, 1, '032021', '', '08_032021_audit_itogi_5s_audita_pdf.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, '122020', '08_032021_workgroup_sostav_rabochey_gruppy_pdf.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `code` varchar(4) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `fio` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `pwd` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `code`, `name`, `fio`, `pwd`) VALUES
(1, '08', 'ЭЦ-Петропавловск', 'Белов Максим Викторович', '12345'),
(2, '13', 'ЦТО', 'Лотц Лариса Петровна', '12345');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `current`
--
ALTER TABLE `current`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `stends`
--
ALTER TABLE `stends`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `current`
--
ALTER TABLE `current`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `stends`
--
ALTER TABLE `stends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
