from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import undetected_chromedriver as uc
from bs4 import BeautifulSoup
import time
from pathlib import Path
import csv
import os
from datetime import datetime

output_filename = 'output.csv'
year = '2024'
months = ['january-01', 'february-02', 'march-03', 'april-04', 'may-05', 'june-06', 'july-07', 'august-08', 'september-09', 'october-10', 'november-11', 'december-12']

limit_by_amount = 100  # note: If set to 0 it will scrape all albums

# Set up options for undetected-chromedriver
options = uc.ChromeOptions()

# Add necessary arguments and options
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument(f"--load-extension={os.path.join(os.path.dirname(__file__), 'uBlock0.chromium')}")

# Optional: add user-agent or other custom options
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36')

# Start the driver with undetected-chromedriver
driver = uc.Chrome(options=options)

# Navigate to a website to test
driver.get('https://www.example.com')

fpath = Path(os.path.join(os.path.dirname(__file__), output_filename))
if fpath.exists():
    fpath.unlink()
fields = ['title', 'artist', 'critic_rating', 'critic_raters', 'user_rating', 'user_raters', 'release_date']
with open(fpath, 'w+', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fields)
    writer.writeheader()

for month in months:
    # Load the page
    time.sleep(1)  # Wait a bit before next call
    url = f"https://www.albumoftheyear.org/{year}/releases/{month}.php"
    driver.get(url)

    cant_find_count = 0
    found_too_many_count = 0

    # Keep clicking the "Show More" button until it is no longer present
    while True:
        if cant_find_count > 5:
            break
        elif limit_by_amount and found_too_many_count > limit_by_amount:
            break
        try:
            # Wait until the "Show More" button is present and clickable
            show_more_button = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, '//div[contains(@class, "largeButton") and contains(text(), "Show More")]'))
            )
            show_more_button.click()
            time.sleep(1)  # Wait a bit for new content to load
            cant_find_count = 0
            found_too_many_count += 1
        except TimeoutException:
            # If the button is not found, break the loop
            print("Show more button not findable.")
            time.sleep(1)  # Wait a bit for new content to load
            cant_find_count += 1
        except Exception as e:
            # Break the loop if the button is no longer found or clickable
            break

    # Parse the page source with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Extract album data (update with the specific tags/classes you need)
    albums_raw = soup.find_all('div', class_='albumBlock five')  # Replace with the actual class
    albums = []
    # Print album titles or relevant data
    for album_raw in albums_raw:
        album_title = album_raw.find('div', class_='albumTitle').text
        album_artist = album_raw.find('div', class_='artistTitle').text
        release_date_str = album_raw.find('div', class_='type').text
        if len(release_date_str.split()) == 1:
            release_date_str += ' 1'  # Append '1' to indicate the 1st day

        # Convert to datetime object with the year added
        release_date = datetime.strptime(f"{year} {release_date_str}", "%Y %b %d").strftime("%d/%m/%Y")
        user_rating = None
        user_raters = None
        critic_rating = None
        critic_raters = None
        rating_blocks = album_raw.find_all('div', class_='ratingRow')
        for rating_block in rating_blocks:
            rating = rating_block.find('div', class_='rating').text
            rating_type = None
            rating_texts = rating_block.find_all('div', class_='ratingText')
            for rating_text in rating_texts:
                rating_text = rating_text.text.lower()
                if rating_text == 'user score':
                    user_rating = rating
                    rating_type = 'user'
                elif rating_text == 'critic score':
                    critic_rating = rating
                    rating_type = 'critic'
                elif '(' in rating_text and rating_type is None and rating_texts[-1] == rating_text:
                    rating_texts.append(rating_text)
                elif '(' in rating_text and rating_type is None:
                    break
                elif '(' in rating_text:
                    raters = rating_text.replace('(','').replace(')','').replace(',','')
                    raters = int(float(raters[:-1])*1000) if 'k' == raters[-1] else int(raters)
                    if rating_type == 'critic':
                        critic_raters = raters
                    elif rating_type == 'user':
                        user_raters = raters
        album = {
            'title': album_title,
            'artist': album_artist,
            'critic_rating': critic_rating,
            'critic_raters': critic_raters,
            'user_rating': user_rating,
            'user_raters': user_raters,
            'release_date': release_date
        }
        albums.append(album)

    # Save albums to CSV file

    with open(fpath, 'a', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fields)
        writer.writerows(albums)

# Close the browser
driver.quit()