# Recipe Home

A recipe discovery app built with Next.js, Tailwind CSS, Spoonacular API, and Claude Vision AI.

## Features

- **3 category tabs** — Desserts, Appetizers, Main Course
- **Popularity sort** — browse top-rated recipes by default
- **Find by ingredients** — upload a photo of your fridge/pantry; Claude AI identifies the ingredients and finds matching recipes
- **Take Photo** — use your device camera directly (mobile-friendly)
- **Cuisine filter** — Indian, Italian, Chinese, Mexican, French, Japanese, Thai, and more
- **Recipe detail** — ingredients with measurements, step-by-step instructions, utensils, full nutrition facts, and YouTube search link

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Recipe data | Spoonacular API |
| Ingredient detection | Claude Vision (claude-haiku) via Anthropic API |
| Language | JavaScript |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up API keys

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your keys:

```env
SPOONACULAR_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

**Where to get keys:**
- **Spoonacular** (free tier — 150 points/day): https://spoonacular.com/food-api
- **Anthropic** (for image AI): https://console.anthropic.com

> Both keys are used server-side only and never exposed to the browser.

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
recipe-app/
├── app/
│   ├── page.js                     # Main page — tabs, filters, recipe grid
│   ├── layout.js
│   ├── globals.css
│   ├── recipe/[id]/
│   │   └── page.js                 # Recipe detail page
│   └── api/
│       ├── recipes/route.js        # Spoonacular search proxy
│       ├── recipe/[id]/route.js    # Spoonacular single recipe proxy
│       └── analyze-image/route.js  # Claude Vision ingredient detection
├── components/
│   ├── TabNav.js          # Desserts / Appetizers / Main Course tabs
│   ├── RecipeCard.js      # Card — image, time, skill badge, star rating
│   ├── RecipeDetail.js    # Detail view with Overview / Ingredients / Steps / Nutrition tabs
│   ├── ImageUpload.js     # Drag-and-drop / file upload modal
│   ├── CuisineFilter.js   # Cuisine dropdown
│   └── NutritionTable.js  # Nutrition facts panel
└── .env.local.example
```

## Recipe Detail

Each recipe page shows:

| Tab | Contents |
|---|---|
| Overview | Description, utensils needed, dietary labels, link to source, YouTube search |
| Ingredients | Name, image thumbnail, amount and unit for each ingredient |
| Steps | Numbered instructions with equipment callouts per step |
| Nutrition | Calories, macros, vitamins with % Daily Value and caloric breakdown |

Skill level (Easy / Medium / Hard) is derived from cook time and ingredient count.

## API Usage Notes

- **Spoonacular free tier** — 150 points/day. Each page load (12 recipes with full info) costs ~24 points, giving ~6 loads per day. Upgrade at spoonacular.com if you need more.
- **Claude Vision** — used only when "Find by Ingredients" or "Take Photo" is triggered. Uses `claude-haiku-4-5` for fast, low-cost responses.
- If either API key is missing, the app shows a clear error message pointing to `.env.local`.

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com). Add `SPOONACULAR_API_KEY` and `ANTHROPIC_API_KEY` as environment variables in the project settings, then push to GitHub and connect the repo.
