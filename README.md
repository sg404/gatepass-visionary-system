# Smart Vehicle Gate Pass System

A modern, comprehensive smart vehicle gate pass system built with React, TypeScript, and Tailwind CSS. This system provides automated vehicle access control, visitor management, and comprehensive reporting for educational institutions and organizations.

## Features

- **Automated Vehicle Access Control**: RFID and ANPR-based entry/exit system
- **Multi-User Roles**: Admin, Security Guards, and Visitors
- **Real-time Monitoring**: Live vehicle tracking and status updates
- **Violation Management**: Automated violation detection and penalty system
- **Comprehensive Reporting**: Detailed analytics and access logs
- **Visitor Management**: Temporary access control for visitors
- **Parking Management**: Automated parking slot allocation
- **Notification System**: Real-time alerts and notifications

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS
- **State Management**: React Query, Local Storage
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form, Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd smart-vehicle-gate-pass-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   ├── ui/            # Base UI components (Button, Card, etc.)
│   └── ...
├── pages/             # Page components
├── data/              # Mock data and constants
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── hooks/             # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

This project can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
