const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateMenuImages() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'burgero',
        port: process.env.DB_PORT || 3306,
    });

    try {
        const connection = await pool.getConnection();

        // Update menu items with correct image URLs
        const menuUpdates = [
            ['http://localhost:5000/images/ClassicBurger.jpg', 'Classic Burger'],
            ['http://localhost:5000/images/TheLebanese.jpg', 'The Lebanese'],
            ['http://localhost:5000/images/MushroomVibes.jpg', 'Mushroom Vibes'],
            ['http://localhost:5000/images/TheBurgero.jpg', 'The Burgero'],
            ['http://localhost:5000/images/TheMozz.jpg', 'The Mozz'],
            ['http://localhost:5000/images/TheSmashBurger.jpg', 'The Smash Burger'],
        ];

        for (const [imageUrl, itemName] of menuUpdates) {
            await connection.execute(
                'UPDATE menu_items SET image_url = ? WHERE name = ?',
                [imageUrl, itemName]
            );
            console.log(`✅ Updated ${itemName}`);
        }

        // Update special items with correct image URLs
        const specialUpdates = [
            ['http://localhost:5000/images/PepperMaize.jpg', 'Pepper Maize'],
            ['http://localhost:5000/images/TruffleBurger.jpg', 'Truffle Burger'],
            ['http://localhost:5000/images/Burgerita.jpg', 'Burgerita'],
        ];

        for (const [imageUrl, itemName] of specialUpdates) {
            await connection.execute(
                'UPDATE special_items SET image_url = ? WHERE title = ?',
                [imageUrl, itemName]
            );
            console.log(`✅ Updated special item ${itemName}`);
        }

        console.log('\n🎉 All menu images updated successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ Error updating menu images:', error.message);
    } finally {
        await pool.end();
    }
}

updateMenuImages();
