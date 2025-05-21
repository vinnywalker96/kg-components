import requests
from bs4 import BeautifulSoup
import json
import os
import time
import random
from urllib.parse import urljoin

# Base URL
BASE_URL = "https://mantech.co.za"
CATEGORIES_URL = f"{BASE_URL}/Categories.aspx"

# Create directories for data
os.makedirs("data", exist_ok=True)

def get_soup(url):
    """Get BeautifulSoup object from URL"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    return BeautifulSoup(response.content, "html.parser")

def extract_categories():
    """Extract all categories from the main page"""
    print("Extracting categories...")
    soup = get_soup(CATEGORIES_URL)
    
    # The categories are in a table row with many categories concatenated
    categories_row = soup.find("tr", {"class": None, "id": None, "style": None})
    
    if not categories_row:
        print("Could not find categories row")
        return []
    
    # Extract text and split by uppercase words
    categories_text = categories_row.get_text(strip=True)
    
    # These are the main categories from the website
    main_categories = [
        "CHEMICALS", "COMPONENTS", "COMPUTER EQUIPMENT", "CONNECTORS", 
        "CONSUMABLES", "CONSUMER GOODS", "ELECTRICAL", "ELECTROMECHANICAL", 
        "ELECTRONIC KITS", "HARDWARE", "IOT", "LITERATURE", "Miscellaneous", 
        "POWER", "RFID", "SECURITY EQUIPMENT", "TEST & MEASUREMENT", "TOOLS", 
        "WIRE & CABLE"
    ]
    
    categories = []
    for category in main_categories:
        categories.append({
            "name": category,
            "url": f"{BASE_URL}/Stock.aspx?Query={category.replace(' ', '+')}"
        })
    
    return categories

def extract_products_from_category(category, max_pages=3):
    """Extract products from a category page"""
    print(f"Extracting products from category: {category['name']}")
    products = []
    
    for page in range(1, max_pages + 1):
        url = category["url"]
        if page > 1:
            url = f"{url}&Page={page}"
        
        soup = get_soup(url)
        product_rows = soup.find_all("tr", {"class": "GridViewRow"})
        
        if not product_rows:
            product_rows = soup.find_all("tr", {"class": "GridViewAlternatingRow"})
        
        if not product_rows:
            print(f"No products found for category {category['name']} on page {page}")
            break
        
        for row in product_rows:
            try:
                # Extract product details
                cells = row.find_all("td")
                if len(cells) < 5:
                    continue
                
                # Get the product link
                product_link = cells[1].find("a")
                if not product_link:
                    continue
                
                product_url = urljoin(BASE_URL, product_link["href"])
                product_code = product_link.text.strip()
                
                # Get part number and manufacturer
                part_number = cells[2].find("span").text.strip() if cells[2].find("span") else ""
                manufacturer = cells[3].find("span").text.strip() if cells[3].find("span") else ""
                
                # Get description
                description = cells[4].find("span").text.strip() if cells[4].find("span") else ""
                
                # Get price (if available)
                price = ""
                if len(cells) > 6:
                    price_cell = cells[6]
                    price = price_cell.find("span").text.strip() if price_cell.find("span") else ""
                
                # Create product object
                product = {
                    "code": product_code,
                    "part_number": part_number,
                    "manufacturer": manufacturer,
                    "description": description,
                    "price": price,
                    "url": product_url,
                    "category": category["name"]
                }
                
                products.append(product)
                
                # Add a small delay to avoid overloading the server
                time.sleep(random.uniform(0.1, 0.3))
                
            except Exception as e:
                print(f"Error extracting product: {e}")
                continue
        
        print(f"Extracted {len(products)} products from {category['name']} (page {page})")
        
        # Add a delay between pages
        time.sleep(random.uniform(1, 2))
    
    return products

def main():
    """Main function to scrape Mantech website"""
    # Extract categories
    categories = extract_categories()
    
    # Save categories to JSON
    with open("data/categories.json", "w") as f:
        json.dump(categories, f, indent=2)
    
    print(f"Extracted {len(categories)} categories")
    
    # Extract products from each category
    all_products = []
    
    for category in categories:
        category_products = extract_products_from_category(category)
        all_products.extend(category_products)
        
        # Save category products to JSON
        with open(f"data/{category['name'].replace(' ', '_').replace('&', 'and')}_products.json", "w") as f:
            json.dump(category_products, f, indent=2)
        
        # Add a delay between categories
        time.sleep(random.uniform(2, 3))
    
    # Save all products to JSON
    with open("data/all_products.json", "w") as f:
        json.dump(all_products, f, indent=2)
    
    print(f"Extracted a total of {len(all_products)} products")

if __name__ == "__main__":
    main()

