<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ThinkShow Investor Readiness Tool (Anthropic Version)

AI-powered investment readiness evaluator for ThinkShow, powered by Claude API.

This is an updated version using **Anthropic's Claude API** instead of Google's Gemini API.

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. Clone the repository:
   ```bash
   git clone https://github.com/Dylanhw-hub/Thinkshow-investor-readiness-tool-anthropic.git
   cd Thinkshow-investor-readiness-tool-anthropic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Anthropic API key:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```
   Get your API key from: https://console.anthropic.com/

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deploy on Vercel

1. Push your changes to GitHub (already done)
2. Go to [Vercel](https://vercel.com/)
3. Click "New Project" and select this repository
4. In the environment variables section, add:
   - **ANTHROPIC_API_KEY**: Your Anthropic API key
5. Click "Deploy"

## What Changed

This version replaces Google's Gemini API with **Anthropic's Claude Sonnet 4** API:
- Removed `@google/genai` dependency
- Replaced all API calls with direct fetch calls to Anthropic endpoint
- Maintains identical function signatures and behavior
- Uses browser-safe API headers for client-side requests

## Key Features

- **Stage-based evaluation** of business readiness
- **Investor lens** customization (Novice, Rising Founder, Serial Pro)
- **Real-time feedback** with scoring and detailed critiques
- **Draft refinement** for pitch optimization
- **Consultation mode** for detailed guidance

## Architecture

- **Frontend**: React + TypeScript + Vite
- **AI Engine**: Anthropic Claude Sonnet 4 API
- **Styling**: Tailwind CSS
