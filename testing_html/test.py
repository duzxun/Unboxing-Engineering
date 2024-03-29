from bs4 import BeautifulSoup
import sys

def extract_style_from_html(html_content):
    # Parse HTML using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find the <style> tag
    style_tag = soup.find_all('style')[0]
    
    # Extract the style content
    if style_tag:
        style_content = style_tag.prettify()
    else:
        style_content = ''
    
    return style_content

def split_html_on_ol(html_file_path):
    # Read HTML file
    with open(html_file_path, 'r') as f:
        html_content = f.read()

    # Extract style content
    style_content = extract_style_from_html(html_content)

    # Parse HTML using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find all <ol> elements
    ol_elements = soup.find_all('ol')

    # Split HTML content on <ol> elements
    sections = []
    start_index = 0
    for ol in ol_elements:
        # Find the index of <ol> tag in the HTML content
        start_index = html_content.find(str(ol), start_index)
        # Split HTML content based on <ol> tag position
        sections.append(style_content + html_content[:start_index])
        html_content = html_content[start_index:]
        start_index = 0

    # Append remaining content after the last <ol> element
    sections.append(style_content + html_content)

    return sections

# Example usage
html_file_path = sys.argv[1]
folder = sys.argv[2]
sections = split_html_on_ol(html_file_path)
for i, section in enumerate(sections):
    soup = BeautifulSoup(section, 'html.parser')
    ol_elements = soup.find_all('ol')
    if len(ol_elements) > 0:
        fname = ""
        cont = ol_elements[0].string
        if "General" in cont:
            fname = "Default-content"
        elif "Computer" in cont:
            fname = "Computer"
        elif "Electrical" in cont:
            fname = "Electrical"
        elif "Industrial" in cont:
            fname = "Industrial"
        elif "Material" in cont:
            fname = "Materials"
        elif "Chemical" in cont:
            fname = "Chemical"
        elif "Mechanical" in cont:
            fname = "Mechanical"
        elif "Mineral" in cont:
            fname = "Mineral"
        elif "Civil" in cont:
            fname = "Civil"
        with open(f'{folder}/{fname}.html', 'w') as f:
            # try and figure out which engineering it is
            soup = BeautifulSoup(section, 'html.parser')
            ol_elements = soup.find_all('ol')
            li_elements = soup.find_all('li')
            div_elements = soup.find_all('div')
            sup_e = soup.find_all('sup')
            for s in sup_e:
                s.extract()
            # Replace <ol> with <div>
            for ol in ol_elements:
                ol.extract()
            # Replace <li> with <div>
            for li in li_elements:
                li.extract()
            for div in div_elements:
                div.extract()
            final = soup.prettify().replace('images/', f'htmx-templates/{folder}/images/')
            f.write(final)

