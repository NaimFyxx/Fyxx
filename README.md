# Fyxx Christmas Landing Page

A festive, responsive landing page for Fyxx's "12 Days of Promos" Christmas campaign.

## 🎄 Overview

This landing page showcases Fyxx's holiday events and promotions, inspired by the Christmas design aesthetics with a red, white, and green color scheme. The page features:

- **Hero Section**: Bold "12 Days of Promos" announcement with decorative elements
- **Holiday Schedule**: Event cards for Jazz Night, Rare Latin Grooves, Choir Live, and New Years celebrations
- **Promos List**: 12 days of special offers from December 13-24
- **Responsive Design**: Optimized for all devices (desktop, tablet, mobile)
- **Smooth Animations**: Fade-in effects and hover interactions

## 🎨 Design Features

### Color Palette
- **Christmas Red**: `#C41E3A` (primary)
- **Christmas Green**: `#0F4C3A` (secondary)
- **Christmas White**: `#FFFFFF`
- **Christmas Cream**: `#F5F5DC` (background)
- **Christmas Gold**: `#D4AF37` (accents)

### Typography
- **Headings**: Libre Baskerville (serif)
- **Body**: Montserrat (sans-serif)

### Layout Sections
1. **Hero Section** - Full-width banner with gradient background
2. **Holiday Schedule** - Grid of event cards with hover effects
3. **12 Days of Promos** - Detailed list of daily promotions
4. **CTA Section** - Call-to-action buttons for shopping and events
5. **Footer** - Company information

## 📁 Files

```
/Fyxx
├── index.html      # Main landing page structure
├── styles.css      # Complete styling and animations
├── script.js       # Interactive features and scroll effects
└── README.md       # This file
```

## 🚀 Usage

### For Standalone Use
Simply open `index.html` in a web browser:
```bash
open index.html
```

### For Web Server Deployment
Upload all files to your web server:
```bash
# Example using SCP
scp index.html styles.css script.js user@server:/var/www/html/christmas/

# Or use FTP/SFTP client
```

### For Shopify Integration
1. Go to Shopify Admin → Online Store → Pages
2. Create a new page called "Christmas Campaign"
3. Use the HTML editor and paste the content from `index.html` (body section only)
4. Add CSS to your theme's `theme.css` or as a custom CSS section
5. Add JavaScript to your theme's `theme.js` or as a custom script

### For Local Development
Use any local server:
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# Then open http://localhost:8000
```

## 🎯 Customization

### Update Event Information
Edit event cards in `index.html`:
```html
<div class="event-card dark-card">
    <p class="event-badge">HAPPY HOLIDAYS!</p>
    <p class="event-day">WEDNESDAY<br>DEC 11</p>
    <h3 class="event-title">YOUR<br>EVENT</h3>
    <p class="event-location">LOCATION</p>
</div>
```

### Update Promotions
Modify the promo list in `index.html`:
```html
<div class="promo-day">
    <span class="day-number">DAY X - DATE</span>
    <span class="promo-description">YOUR PROMO TEXT</span>
</div>
```

### Change Colors
Update CSS variables in `styles.css`:
```css
:root {
    --christmas-red: #C41E3A;
    --christmas-green: #0F4C3A;
    /* Modify these values */
}
```

### Add Countdown Timer
Uncomment the countdown element in `index.html` and update the date in `script.js`:
```javascript
const countdownDate = new Date('December 13, 2025 00:00:00').getTime();
```

### Enable Snow Effect
Uncomment the snow effect in `script.js`:
```javascript
setInterval(createSnowflake, 300);
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: < 480px

## ✨ Features

- ✅ Fully responsive design
- ✅ Smooth scroll animations
- ✅ Interactive hover effects
- ✅ Cross-browser compatible
- ✅ Optimized for performance
- ✅ SEO-friendly structure
- ✅ Accessible HTML5 markup
- ✅ Google Fonts integration

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

© 2025 Fyxx. All rights reserved.

## 🎅 Credits

Designed and developed for Fyxx's Christmas 2025 campaign.
Location: Amman, Jordan

---

**Happy Holidays from Fyxx! 🎄**