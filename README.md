# KnowledgeNexus

KnowledgeNexus — цифровой ассистент для работы с базами знаний, объединяющий различные источники информации в единую, модульную платформу.

Проект разработан за 48 часов

## Основной функционал

- **Создание баз знаний:** Лёгкое создание и управление информационными ресурсами.
- **Кастомизация интерфейса чата:** Гибкая настройка внешнего вида и функционала для комфортного взаимодействия.
- **Генерация ответов:** Алгоритмы для формирования релевантных ответов на основе загруженных данных.
- **Поддержка мультимедиа и СУБД:** Интеграция документов, аудио, изображений и баз данных.
- **Распознавание текста (OCR):** Автоматическое извлечение текста из изображений.
- **Текстовое описание аудио (CLAP):** Преобразование аудиофайлов в текстовые описания.
- **Текстовое описание изображения (CLIP):** Генерация текстовых описаний по содержимому изображений.

# Интерфейс

## Управление базами знаний

![1](https://github.com/user-attachments/assets/c197c28f-cb2f-40a9-b332-94232a9a9460)


## Кастомизация чата

![2](https://github.com/user-attachments/assets/9b2990e8-e78c-40a8-905e-9d209a5111e4)


## Создание базы знаний

![3](https://github.com/user-attachments/assets/e85040d5-e52a-4ff8-9ed3-1905f4df9463)


### Установка и запуск

#### Системные требования

- **Node.js** версии 14.x или выше
- **Yarn** версии 1.x или 2.x

#### Шаги для установки:

Установите зависимости с помощью Yarn:

```bash
yarn install
```

Сборка проекта для продакшена:

```bash
yarn build
```

Для запуска собранного приложения используйте команду:

```bash
yarn preview
```

Для поднятия чата необходимо

```bash
cd chat-widget
python3 -m http.server 9012
```

---

### Технологии

Проект построен с использованием следующих технологий:

- **React** — основа для создания интерфейса
- **Mobx** — для управления состоянием приложения
- **Vite** — инструмент для сборки проекта, обеспечивающий быструю разработку
- **TypeScript** — строго типизированный язык, повышающий надежность кода
- **Yarn** — пакетный менеджер
- **Chakra UI** — библиотека компонентов для создания UI
- **FSD (Feature-Sliced Design)** — архитектурный подход для организации кода

---

### Архитектура проекта (FSD)

В приложении используется архитектурный подход **Feature-Sliced Design** (FSD), который позволяет легко масштабировать и поддерживать проект. Структура проекта разделена на модули с четким разграничением по слоям:

1. **app** — Инициализация приложения и глобальные конфигурации (например, Redux и роутинг).
2. **pages** — Страницы, которые объединяют несколько виджетов и функциональных модулей.
3. **widgets** — Независимые UI-компоненты, которые могут объединять несколько фич или сущностей.
4. **features** — Бизнес-логика и функциональные элементы, такие как взаимодействие с API и управление состоянием.
5. **entities** — Модели и сущности, используемые в приложении (например, задачи, пользователи).
6. **shared** — Переиспользуемые элементы, такие как утилиты, типы, константы и базовые UI-компоненты.

Пример структуры файлов:

```bash
src/
├── app/             # Инициализация приложения
├── pages/           # Страницы
├── widgets/         # Виджеты (комплексные компоненты)
├── features/        # Фичи (логические блоки)
├── entities/        # Сущности (базовые модели и их логика)
├── shared/          # Общие модули и компоненты
```

---

### Настройка линтинга

В проекте используется ESLint для проверки кода на соответствие стандартам качества. Ниже приведена конфигурация ESLint:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
)
```

Эта конфигурация:

- Поддерживает правила для TypeScript и React.
- Использует плагины для управления хуками и Fast Refresh.
- Игнорирует папку `dist`.

### Команды для линтинга

В нашем проекте определены следующие команды для линтинга:

- **ESLint** — проверка кода на ошибки и несоответствие стандартам.
- **Prettier** — форматирование кода.
- **TypeScript** — проверка типов.

### Скрипты в `package.json`

Ваш `package.json` также включает скрипты для сборки и разработки:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "yarn lint:type && yarn lint:eslint && yarn lint:prettier",
    "preview": "vite preview"
  }
}
```

1. **`dev`** — запуск приложения в режиме разработки.
2. **`build`** — сборка проекта для продакшена. Включает компиляцию TypeScript и сборку с Vite.
3. **`lint`** — последовательный запуск всех линтинговых проверок: для TypeScript, ESLint и Prettier.
4. **`preview`** — запуск предварительного просмотра собранного приложения.

### Инструкции по запуску линтинга

- Чтобы запустить проверку кода перед сборкой или в ходе разработки, используйте команду:

  ```bash
  yarn lint
  ```

- Для форматирования кода (если есть ошибки форматирования), используйте:
  ```bash
  yarn format
  ```

---
