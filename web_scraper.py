import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

def scrape_amazon(query):
    ua = UserAgent()
    headers = {'User-Agent': ua.random}
    url = f"https://www.amazon.com.tr/s?k={query.replace(' ', '+')}"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        products = []
        for item in soup.select('.s-result-item'):
            name = item.select_one('.a-text-normal')
            price = item.select_one('.a-price-whole')
            link = item.select_one('a.a-link-normal')
            
            if name and price and link:
                products.append({
                    "marka": name.text.split()[0],
                    "model": " ".join(name.text.split()[1:3]),
                    "fiyat": price.text.replace('.', '').replace(',', '.'),
                    "link": f"https://amazon.com.tr{link['href']}"
                })
        return products[:5]  # İlk 5 ürün
        
    except Exception as e:
        print(f"Scraping error: {str(e)}")
        return []