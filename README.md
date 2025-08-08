# 🚀 Dynamic Form Builder - UpAlliance Assessment

A modern, feature-rich dynamic form builder built with React, TypeScript, Material-UI, and Redux. This application allows users to create, configure, and manage dynamic forms with advanced validation rules and derived field capabilities.

## ✨ Features

### 🏗️ Form Builder (`/create`)
- **7 Field Types**: Text, Number, Textarea, Select, Radio, Checkbox, and Date
- **Advanced Configuration**: Label, required toggle, default values, and validation rules
- **Comprehensive Validation**: Required fields, min/max length, email format, password rules, and custom validation
- **Derived Fields**: Create computed fields based on other field values (e.g., Age from Date of Birth)
- **Field Management**: Add, delete, and reorder fields with drag-and-drop visual indicators
- **Real-time Preview**: See changes as you build

### 👀 Form Preview (`/preview`)
- **End-User Experience**: Interact with forms exactly as your users will
- **Live Validation**: Real-time validation with custom error messages
- **Derived Field Updates**: Automatic computation as parent fields change
- **Form Submission**: Test form submission flow (preview mode)

### 📚 My Forms (`/myforms`)
- **Form Library**: View all saved forms with creation dates and field counts
- **Quick Actions**: Preview, edit, or delete forms with one click
- **Form Analytics**: See field type distributions and derived field indicators
- **Persistent Storage**: All forms saved to localStorage

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Date Handling**: Day.js
- **Styling**: Emotion (CSS-in-JS)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd upallianceAssessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Usage Guide

### Creating Your First Form

1. **Navigate to Create** (`/create`)
2. **Add Fields**: Click "Add Field" and select field type
3. **Configure Fields**: Click the settings icon to configure validation and options
4. **Set Validation**: Add required rules, length constraints, or custom validation
5. **Save Form**: Give your form a name and save it

### Field Types & Configuration

#### Text Fields
- **Text Input**: Single line text with validation
- **Textarea**: Multi-line text input
- **Number**: Numeric input with range validation
- **Date**: Date picker with calendar interface

#### Selection Fields
- **Select**: Dropdown with custom options
- **Radio**: Radio button group
- **Checkbox**: Boolean toggle

#### Advanced Features
- **Derived Fields**: Automatically computed values
- **Custom Validation**: Business logic validation rules
- **Field Dependencies**: Link fields together

### Validation Rules

- **Required**: Field must have a value
- **Length**: Minimum and maximum character limits
- **Email**: Valid email format validation
- **Password**: Strength requirements (8+ chars, numbers)
- **Custom**: User-defined validation logic

### Derived Fields

Create fields that automatically calculate values based on other fields:

```typescript
// Example: Age calculation
Field: "Age"
Type: "Derived"
Formula: "Age = Current Date - Date of Birth"
Parent Fields: ["dateOfBirth"]
```

## 🎨 UI/UX Features

### Modern Design
- **Material Design**: Clean, intuitive interface
- **Responsive Layout**: Works on all device sizes
- **Color Scheme**: Professional blue and orange palette
- **Typography**: Clear, readable fonts

### User Experience
- **Intuitive Navigation**: Clear route structure
- **Visual Feedback**: Loading states, success messages, error handling
- **Accessibility**: ARIA labels, keyboard navigation
- **Responsive Design**: Mobile-first approach

## 🔧 Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── FormBuilder.tsx     # Main form builder
│   ├── FieldConfigDialog.tsx # Field configuration
│   ├── FormPreview.tsx      # Form preview
│   ├── MyForms.tsx          # Form library
│   └── SaveFormDialog.tsx   # Save form dialog
├── store/              # Redux store
│   ├── index.ts            # Store configuration
│   └── formBuilderSlice.ts # Form state management
├── types/               # TypeScript definitions
│   └── index.ts            # Type interfaces
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

### State Management
- **Redux Toolkit**: Centralized state management
- **Local Storage**: Persistent form storage
- **Real-time Updates**: Immediate UI feedback

### Data Flow
1. User actions trigger Redux actions
2. State updates trigger component re-renders
3. Changes automatically sync to localStorage
4. Form preview reflects current state

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code style enforcement
- **Modern React**: Hooks, functional components
- **Clean Architecture**: Separation of concerns

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Zero-config deployment
- **Netlify**: Drag & drop deployment
- **GitHub Pages**: Free hosting
- **Any Static Host**: Upload `dist/` folder

### Environment Variables
No environment variables required - fully client-side application.

## 🔮 Future Enhancements

### Planned Features
- **Drag & Drop**: Visual field reordering
- **Form Templates**: Pre-built form designs
- **Export/Import**: JSON form sharing
- **Advanced Validation**: Custom JavaScript rules
- **Form Analytics**: Usage statistics
- **Collaboration**: Multi-user form editing

### Technical Improvements
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Cypress integration
- **Performance**: React.memo optimization
- **Bundle Size**: Code splitting and lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for the UpAlliance assessment. All rights reserved.

## 🙏 Acknowledgments

- **Material-UI**: Beautiful component library
- **Redux Toolkit**: Excellent state management
- **Vite**: Fast build tooling
- **React Team**: Amazing framework

---

**Built with ❤️ for UpAlliance Assessment**

*Ready to build amazing forms? Start creating today!*
