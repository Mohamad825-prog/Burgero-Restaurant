Burgero Restaurant Website
https://img.shields.io/badge/Burgero-Restaurant-orange
https://img.shields.io/badge/React-19.2.0-blue
https://img.shields.io/badge/Tailwind-CSS-38B2AC

A modern, responsive website for Burgero Restaurant in Saida, Lebanon, built with React and Tailwind CSS.

🍔 Project Description
Burgero is a fully responsive restaurant website that showcases the restaurant's menu, special offers, and provides an intuitive ordering system. The website features a clean, modern design with smooth animations and excellent user experience across all devices.

✨ Key Features
Responsive Design - Optimized for desktop, tablet, and mobile devices

Interactive Menu - Beautiful display of burger items with hover effects

Online Ordering - Modal-based order system with form validation

Testimonial Carousel - Customer reviews with smooth sliding animation

Contact Form - Fully functional contact form with validation

Modern UI/UX - Clean design with consistent branding and smooth transitions

🚀 Live Demo
Visit the live website: Burgero Restaurant

🛠️ Technologies Used
Frontend Framework: React 19.2.0

Styling: Tailwind CSS 3.4.18

Routing: React Router DOM 7.9.6

Icons: React Icons 5.5.0

Carousel: React Slick

Deployment: GitHub Pages

📦 Setup Instructions
Prerequisites
Node.js (version 14 or higher)

npm or yarn

Installation Steps
Clone the repository

bash
git clone https://github.com/Mohamad825-prog/burgero_project.git
cd burgero_project
Install dependencies

bash
npm install
Start the development server

bash
npm start
Open your browser
Navigate to http://localhost:3000 to view the application

Build for Production
bash
npm run build
Deploy to GitHub Pages
bash
npm run deploy
🎯 Project Structure
text
src/
├── components/          # Reusable UI components
│   ├── Contact.js      # Contact form component
│   ├── Footer.js       # Footer with links and social media
│   ├── Hero.js         # Hero section with CTA
│   ├── Meals.js        # Hot meals showcase
│   ├── Menu.js         # Main menu display
│   ├── Navbar.js       # Navigation header
│   ├── OrderModal.js   # Order placement modal
│   ├── SpecialMenu.js  # Special menu items
│   └── Testimonial.js  # Customer testimonials
├── layouts/            # Layout components
│   ├── MenuCard.js     # Individual menu item card
│   ├── SpecialMenuCard.js # Special menu card
│   └── TestimonialCard.js # Testimonial card
├── pages/              # Page components
│   ├── ContactPage.js
│   ├── HomePage.js
│   ├── MealsPage.js
│   ├── MenuPage.js
│   ├── SpecialMenuPage.js
│   └── TestimonialPage.js
├── assets/             # Images and static files
├── App.js              # Main application component
└── index.js            # Application entry point
🎨 Color Scheme
The website uses a consistent color palette:

Primary: #f8981f (Orange) - Used for buttons and highlights

Secondary: #e54416 (Red) - Used for headings and important elements

Tertiary: #f5ede3 (Beige) - Used for backgrounds

📱 Screenshots
Home Page
https://via.placeholder.com/800x400/FFA500/FFFFFF?text=Burgero+Home+Page
Hero section with call-to-action and appetizing burger image

Menu Page
https://via.placeholder.com/800x400/FFA500/FFFFFF?text=Menu+Page
Grid layout showcasing various burger options with prices and descriptions

Special Menu
https://via.placeholder.com/800x400/FFA500/FFFFFF?text=Special+Menu
Featured special items with star ratings and pricing

Order Modal
https://via.placeholder.com/600x400/FFA500/FFFFFF?text=Order+Modal
Interactive order form with validation and time selection

Testimonials
https://via.placeholder.com/800x400/FFA500/FFFFFF?text=Customer+Testimonials
Carousel displaying customer reviews and ratings

Contact Page
https://via.placeholder.com/800x400/FFA500/FFFFFF?text=Contact+Us
Contact form with restaurant information and social media links

Mobile View
https://via.placeholder.com/400x600/FFA500/FFFFFF?text=Mobile+View
Responsive design optimized for mobile devices

🔧 Customization
Adding New Menu Items
Edit the menuData array in src/components/Menu.js:

jsx
const menuData = [
  {
    id: 7,
    name: 'New Burger',
    price: '$12',
    description: 'Your delicious description',
    image: NewBurgerImage
  },
  // ... more items
];
Modifying Colors
Update the color scheme in tailwind.config.js:

js
theme: {
  extend: {
    colors: {
      primary: "#your-primary-color",
      secondary: "#your-secondary-color",
      tertiary: "#your-tertiary-color",
    },
  },
}
🌟 Features in Detail
Responsive Navigation
Fixed header with logo and navigation links

Mobile-friendly hamburger menu (planned)

Order Now button accessible from all pages

Interactive Components
Hover effects on cards and buttons

Form validation with visual feedback

Smooth transitions and animations

Modal windows for enhanced UX

Performance Optimizations
Component-based architecture

Efficient re-rendering with React hooks

Optimized images and assets

Clean code structure

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Developer
Mohamad Khairallah

GitHub: @Mohamad825-prog

Project Repository: burgero_project

🙏 Acknowledgments
React community for excellent documentation

Tailwind CSS for the utility-first framework

React Icons for the beautiful icon set

Burgero Saida for the inspiration and content