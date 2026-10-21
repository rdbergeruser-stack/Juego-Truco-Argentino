import urllib.request
import re
import os

os.makedirs('fonts', exist_ok=True)
req = urllib.request.Request(
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Lora:wght@600;700&display=swap',
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)

with urllib.request.urlopen(req) as resp:
    css = resp.read().decode('utf-8')

blocks = re.findall(r'@font-face\s*\{([^}]+)\}', css)
for b in blocks:
    family = re.search(r'font-family:\s*[\'"]([^\'"]+)[\'"]', b).group(1)
    weight = re.search(r'font-weight:\s*(\d+)', b).group(1)
    url = re.search(r'src:\s*url\((https://[^)]+\.ttf)\)', b).group(1)
    filename = f'fonts/{family}_{weight}.ttf'
    print(f'Downloading {filename}...')
    urllib.request.urlretrieve(url, filename)
    print(f'Done: {filename}')

print('All site fonts downloaded successfully!')
