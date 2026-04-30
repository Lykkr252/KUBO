# IMPORT LIBRARIES
# We bring in tools from Flask to handle web server tasks (like routing, templates, and sessions)
from flask import Flask, redirect, request, render_template, session, url_for
# We bring in the mariadb library so Python can talk to our database
import mariadb

# Create the actual Flask web application object
app = Flask(__name__)
# The secret key is used to lock and secure the 'session' cookies. 
# CHANGE THIS to a random string!
app.secret_key = "some_random_secret_string"

# Save our HTML file names into variables so we don't have to retype them
HOME_TEMPLATE = 'index.html'
PRODUCTS_TEMPLATE = 'products.html'
PROFILE_TEMPLATE = 'profile.html'



# Create a function to connect to the database. We will use this in every route!
def get_db_connection():
    #-----------------------------------------
    # CHANGE THESE: Use your own database connection details!
    #-----------------------------------------
    conn = mariadb.connect(
        user="gb50", 
        password="gb50_password", 
        host="127.0.0.1", 
        port=3306, 
        database="gb50_DB"
    )
    # Return the active connection so the rest of the code can use it
    return conn

# -----------------------------------------
# ROUTE: HOME PAGE
# -----------------------------------------
# When a user visits the main URL ('/'), run this function
@app.route('/', methods=['GET'])
def home():
    """Serve the login/register page."""
    # Check if the user is already logged in by looking for 'userid' in their session cookie
    if 'userid' in session:
        # If they are logged in, send them straight to their profile page
        return redirect(url_for('profile_page'))
    
    # If they are not logged in, show them the home page template
    return render_template(HOME_TEMPLATE)

# -----------------------------------------
# ROUTE: REGISTER A NEW USER
# -----------------------------------------
# When the HTML registration form is submitted, it comes here
@app.route('/register', methods=['POST'])
def register():
    """Processes the HTML registration form."""
    # Get what they typed in the 'username' box and remove extra spaces (.strip)
    username = request.form.get('username', '').strip()
    # Get what they typed in the 'password' box
    password = request.form.get('password', '')

    # If the username or password box was empty...
    if not username or not password:
        # Send them back to the home page with an error message
        return render_template(HOME_TEMPLATE, reg_error='Both fields are required')

    # Connect to the database
    conn = get_db_connection()
    # Create a cursor (the tool that actually runs the SQL commands)
    cursor = conn.cursor()
    
    # Ask the database if this username already exists
    # Notice the comma (username,) - Python requires this when checking one variable!
    cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
    
    # If the database finds a match...
    if cursor.fetchone():
        # Close the connection and show an error
        conn.close()
        return render_template(HOME_TEMPLATE, reg_error='Username already taken')

    # If the username is free, insert the new user into the database
    cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
    # Save (commit) the changes to the database
    conn.commit()
    # Close the database connection
    conn.close()

    # Send them back to the home page with a success message
    return render_template(HOME_TEMPLATE, reg_success='Registration successful! You can now log in.')

# -----------------------------------------
# ROUTE: LOGIN
# -----------------------------------------
# When the HTML login form is submitted, it comes here
@app.route('/login', methods=['POST'])
def login():
    """Processes the HTML login form."""
    # Get the username and password they typed in
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '')

    # If they didn't type a username, show an error
    if not username:
        return render_template(HOME_TEMPLATE, login_error='Username is required')

    # Connect to the database and create a cursor
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Try to find the user's ID and password in the database
    cursor.execute('SELECT id, password FROM users WHERE username = ?', (username,))
    # Grab the first row of results
    row = cursor.fetchone()
    # Close the connection
    conn.close()

    # If row is empty (user does not exist)...
    if not row:
        return render_template(HOME_TEMPLATE, login_error='User not found')
        
    # The database gives us a list back. 
    # Grab the first item [0] as the ID, and the second item [1] as the password
    user_id = row[0]
    stored_password = row[1]
    
    # Check if the password they typed matches the password in the database
    if stored_password == password:
        # If it matches, save their ID into the browser's session cookie
        session['userid'] = user_id
        # Send them to the profile page
        return redirect(url_for('profile_page'))
    else:
        # If the password is wrong, show an error
        return render_template(HOME_TEMPLATE, login_error='Wrong password')

# -----------------------------------------
# ROUTE: PROFILE PAGE
# -----------------------------------------
# Show the user their profile and their own products
@app.route('/profile', methods=['GET'])
def profile_page():
    """Fetches user data and their products, then renders the profile."""
    # If there is no 'userid' in the session, they are not logged in!
    if 'userid' not in session:
        # Send them back to the home page
        return redirect(url_for('home'))
        
    # Get the user's ID from the session cookie
    user_id = session['userid']
    
    # Connect to the database
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get the user's information from the database
    cursor.execute('SELECT username, password, role, created_at FROM users WHERE id = ?', (user_id,))
    user_row = cursor.fetchone()
    
    # If the user was deleted from the database but still has a cookie...
    if not user_row:
        # Remove their cookie and send them home
        session.pop('userid', None)
        return redirect(url_for('home'))

    # Create a Python Dictionary to hold the user's info
    user_data = {
        'username': user_row[0],
        'password': user_row[1],
        'role': user_row[2],
        'created_at': user_row[3]
    }
    
    # Get all the products created by this user, ordered by newest first
    cursor.execute('SELECT title, price, created_at FROM products WHERE userid = ? ORDER BY created_at DESC', (user_id,))
    
    # Create an empty list to hold the products
    user_products = []
    # Grab all the rows from the database
    rows = cursor.fetchall()
    
    # Loop through every row the database gave us
    for row in rows:
        # Create a dictionary for this specific product
        product = {
            'title': row[0],
            'price': row[1],
            'created_at': row[2]
        }
        # Add this product to our list
        user_products.append(product)
        
    # Close the database connection
    conn.close()
    
    # Send the user to the profile page, and hand the HTML the user_data and user_products variables
    return render_template(PROFILE_TEMPLATE, user_data=user_data, products=user_products)

# -----------------------------------------
# ROUTE: CREATE A PRODUCT
# -----------------------------------------
# When a user submits a new product, it comes here
@app.route('/create_product', methods=['POST'])
def create_product():
    """Records a new product from the HTML form and reloads the profile."""
    # Ensure the user is logged in
    if 'userid' not in session:
        return redirect(url_for('home'))

    # Get the title and price from the HTML form
    title = request.form.get('title', '').strip()
    price = request.form.get('price', '').strip()
    # Get the user's ID from the session cookie
    user_id = session['userid']

    # If they typed both a title and price...
    if title and price:
        # Connect to DB and insert the new product
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO products (title, price, userid) VALUES (?, ?, ?)', (title, price, user_id))
        # Save changes and close
        conn.commit()
        conn.close()

    # Send them back to their profile to see their new product
    return redirect(url_for('profile_page'))

# -----------------------------------------
# ROUTE: ALL PRODUCTS FEED
# -----------------------------------------
# Show a page with EVERY product from every user
@app.route('/products', methods=['GET'])
def all_products():
    """Displays a global feed of all products in the database."""
    # Connect to the database
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # We use INNER JOIN to get the text of the product AND the username of who added it
    query = '''
        SELECT products.title, products.price, products.created_at, users.username 
        FROM products 
        INNER JOIN users ON products.userid = users.id 
        ORDER BY products.created_at DESC
    '''
    cursor.execute(query)
    
    # Create an empty list (array) to hold all the products
    all_products_list = []
    # Grab all the results
    rows = cursor.fetchall()
    
    # Loop through the database results
    for row in rows:
        # Create a dictionary for the product
        product = {
            'title': row[0],
            'price': row[1],
            'created_at': row[2],
            'author': row[3]
        }
        # Add it to our list
        all_products_list.append(product)
        
    # Close the database
    conn.close()
    
    # Render the products HTML page, handing it our list of all products
    return render_template(PRODUCTS_TEMPLATE, products=all_products_list)

# -----------------------------------------
# ROUTE: LOGOUT
# -----------------------------------------
# When the user clicks logout, it comes here
@app.route('/logout', methods=['GET'])
def logout():
    # Remove the 'userid' from their session cookie
    session.pop('userid', None)
    # Send them back to the home page
    return redirect(url_for('home'))

# -----------------------------------------
# ROUTES: ADDITIONAL PAGES
# -----------------------------------------
@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')

@app.route('/moduler', methods=['GET'])
def moduler():
    return render_template('moduler.html')

@app.route('/spil', methods=['GET'])
def spil():
    return render_template('spil.html')

@app.route('/kalender', methods=['GET'])
def kalender():
    return render_template('kalender.html')

@app.route('/tidsstyring', methods=['GET'])
def tidsstyring():
    return render_template('tidsstyring.html')

@app.route('/abonnement', methods=['GET'])
def abonnement():
    return render_template('abonnement.html')

@app.route('/kontakt', methods=['GET'])
def kontakt():
    return render_template('kontakt.html')

@app.route('/checkout', methods=['GET'])
def checkout():
    return render_template('checkout.html')

@app.route('/laerer', methods=['GET'])
def laerer():
    return render_template('laerer.html')

@app.route('/login-page', methods=['GET'])
def login_page():
    return render_template('login.html')

# -----------------------------------------
# RUN THE APPLICATION
# -----------------------------------------
# This tells Python to start the server!

# CHANGE THIS: Use your assigned Port number! Use a number above 64000 and below 64199. I recommend 640XX where XX is your group number. For example, if you are group 5, use 64005.
PORT_NUMBER = 64028

if __name__ == '__main__':
    # CHANGE THIS: Use your assigned Port number!
    app.run(host='130.225.170.248', port=PORT_NUMBER)