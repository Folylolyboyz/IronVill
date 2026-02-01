import requests
from bs4 import BeautifulSoup

from utils.config import get_version_links

VERSION_LINKS = get_version_links()

def get_all_versions_vanilla():
    LINK = f"{VERSION_LINKS["vanilla"]}/index.html"
    page = requests.get(LINK)
    
    soup = BeautifulSoup(page.text, "html.parser")
    
    all_divs = soup.find("div", class_ = "items overflow-y-auto overflow-x-hidden snap-y snap-proximity lg:snap-none scrollbar-custom")
    
    versions = [
        div["data-version"]
        for div in all_divs.find_all("div", class_="ncItem")
        if div.has_attr("data-version")
    ]
    
    return versions


def get_download_link_vanilla(version):
    LINK = f"{VERSION_LINKS["vanilla"]}/download/{version}"
    page = requests.get(LINK)
    
    soup = BeautifulSoup(page.text, "html.parser")
    
    all_anchors = soup.find("a", class_ = "downloadJar")
    
    return all_anchors["href"]
    

if __name__ == "__main__":
    print(get_all_versions_vanilla())
    print(get_download_link_vanilla("1.21.11"))