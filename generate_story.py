import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_instagram_story():
    W, H = 1080, 1920
    story = Image.new('RGB', (W, H), (20, 10, 5))
    draw = ImageDraw.Draw(story)
    
    # 1. FONDO: MADERA DE PULPERÍA CON CANDIL CÁLIDO
    # Dibujar tablones de madera
    plank_h = 75
    for y in range(0, H, plank_h):
        # Color base del tablón con leves variaciones
        base_c = (28 + (y % 7), 14 + (y % 5), 8 + (y % 4))
        draw.rectangle([0, y, W, y + plank_h], fill=base_c)
        # Línea de unión entre tablones
        draw.line([0, y, W, y], fill=(12, 6, 3), width=3)
        draw.line([0, y + 1, W, y + 1], fill=(45, 25, 12), width=1)
        
    # Gradiente radial cálido (resplandor de farol de campo en el tercio superior)
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    cx, cy = W // 2, 700
    for r in range(800, 0, -25):
        alpha = int((1.0 - (r / 800.0)) * 140)
        glow_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(245, 158, 11, alpha))
    story.paste(glow, (0, 0), glow)
    
    # Viñeta oscura en bordes superior e inferior
    vignette = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for y in range(250):
        a = int((1.0 - y / 250.0) * 220)
        v_draw.line([0, y, W, y], fill=(10, 5, 2, a))
    for y in range(H - 350, H):
        a = int(((y - (H - 350)) / 350.0) * 240)
        v_draw.line([0, y, W, y], fill=(10, 5, 2, a))
    story.paste(vignette, (0, 0), vignette)
    
    # FUENTES
    try:
        font_tag = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 24)
        font_title = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 72)
        font_subtitle = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 38)
        font_body = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 28)
        font_badge = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 26)
        font_cta = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 40)
        font_phone_title = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 20)
        font_phone_score = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 22)
        font_phone_btn = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
    except Exception as e:
        print('Error loading fonts:', e)
        font_tag = font_title = font_subtitle = font_body = font_badge = font_cta = ImageFont.load_default()

    # 2. ENCABEZADO DE LA HISTORIA
    # Badge superior de bandera argentina
    tag_text = "🇦🇷 EL JUEGO NACIONAL ARGENTINO 🇦🇷"
    tag_box = draw.textbbox((0, 0), tag_text, font=font_tag)
    tag_w = tag_box[2] - tag_box[0]
    tag_x = (W - tag_w) // 2
    tag_y = 70
    draw.rounded_rectangle([tag_x - 20, tag_y - 6, tag_x + tag_w + 20, tag_y + 36], radius=18, fill=(15, 23, 42), outline=(56, 189, 248), width=2)
    draw.text((tag_x, tag_y), tag_text, font=font_tag, fill=(186, 230, 253))
    
    # Título Principal "TRUCO CRIOLLO"
    title_text = "TRUCO CRIOLLO"
    t_box = draw.textbbox((0, 0), title_text, font=font_title)
    t_w = t_box[2] - t_box[0]
    t_x = (W - t_w) // 2
    t_y = 135
    # Sombra del título
    draw.text((t_x + 4, t_y + 5), title_text, font=font_title, fill=(0, 0, 0))
    draw.text((t_x, t_y), title_text, font=font_title, fill=(254, 240, 138))
    
    # Subtítulo llamativo
    sub_text = "¡JUGÁ CON AMIGOS ONLINE!"
    s_box = draw.textbbox((0, 0), sub_text, font=font_subtitle)
    s_w = s_box[2] - s_box[0]
    s_x = (W - s_w) // 2
    s_y = 230
    draw.text((s_x + 2, s_y + 2), sub_text, font=font_subtitle, fill=(0, 0, 0))
    draw.text((s_x, s_y), sub_text, font=font_subtitle, fill=(245, 158, 11))

    # 3. MOCKUP DE TELÉFONO MÓVIL (PANTALLA DE JUEGO REAL)
    phone_w, phone_h = 560, 680
    phone_x = (W - phone_w) // 2
    phone_y = 310
    
    # Sombra del teléfono
    phone_shadow = Image.new('RGBA', (phone_w + 60, phone_h + 60), (0, 0, 0, 0))
    ps_draw = ImageDraw.Draw(phone_shadow)
    ps_draw.rounded_rectangle([20, 20, phone_w + 40, phone_h + 40], radius=45, fill=(0, 0, 0, 180))
    phone_shadow = phone_shadow.filter(ImageFilter.GaussianBlur(25))
    story.paste(phone_shadow, (phone_x - 30, phone_y - 20), phone_shadow)
    
    # Carcasa del teléfono (Bisel oscuro pulido)
    phone_img = Image.new('RGBA', (phone_w, phone_h), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(phone_img)
    p_draw.rounded_rectangle([0, 0, phone_w, phone_h], radius=40, fill=(24, 24, 27), outline=(217, 119, 6), width=3)
    
    # Pantalla del teléfono (Interior)
    screen_margin = 12
    sw = phone_w - 2 * screen_margin
    sh = phone_h - 2 * screen_margin
    p_draw.rounded_rectangle([screen_margin, screen_margin, phone_w - screen_margin, phone_h - screen_margin], radius=32, fill=(20, 10, 5))
    
    # Mesa de paño verde dentro de la pantalla
    felt_top = 80
    felt_h = sh - 150
    p_draw.rounded_rectangle([screen_margin + 10, felt_top, phone_w - screen_margin - 10, felt_top + felt_h], radius=24, fill=(20, 83, 45), outline=(120, 53, 15), width=6)
    
    # Header del teléfono
    p_draw.text((screen_margin + 20, 30), "🧉 Truco Criollo Online", font=font_phone_title, fill=(253, 230, 138))
    p_draw.rounded_rectangle([phone_w - screen_margin - 110, 26, phone_w - screen_margin - 20, 56], radius=12, fill=(4, 120, 87))
    p_draw.text((phone_w - screen_margin - 95, 32), "SALA #1", font=font_phone_title, fill=(255, 255, 255))
    
    # Tanteador dentro del teléfono
    score_y = felt_top + 15
    p_draw.rounded_rectangle([screen_margin + 25, score_y, phone_w - screen_margin - 25, score_y + 45], radius=12, fill=(15, 23, 42, 220), outline=(245, 158, 11), width=1)
    p_draw.text((screen_margin + 45, score_y + 10), "NOSOTROS: 18 (Buenas)", font=font_phone_score, fill=(56, 189, 248))
    p_draw.text((screen_margin + 320, score_y + 10), "ELLOS: 14", font=font_phone_score, fill=(244, 63, 94))
    
    # Cartas miniatura jugadas en el centro de la mesa
    try:
        mini_card1 = Image.open('public/cards/espada_1.png').resize((85, 130), Image.Resampling.LANCZOS)
        mini_card2 = Image.open('public/cards/oro_7.png').resize((85, 130), Image.Resampling.LANCZOS)
        mini_card3 = Image.open('public/cards/copa_3.png').resize((85, 130), Image.Resampling.LANCZOS)
        
        # Rotar y pegar en la pantalla del celular
        c1_rot = mini_card1.rotate(-10, expand=True)
        c2_rot = mini_card2.rotate(8, expand=True)
        c3_rot = mini_card3.rotate(-3, expand=True)
        
        phone_img.paste(c2_rot, (phone_w // 2 - 110, felt_top + 95), c2_rot.convert('RGBA'))
        phone_img.paste(c3_rot, (phone_w // 2 + 15, felt_top + 90), c3_rot.convert('RGBA'))
        phone_img.paste(c1_rot, (phone_w // 2 - 50, felt_top + 105), c1_rot.convert('RGBA'))
    except Exception as e:
        print('Error pasting mini cards:', e)
        
    # Canto flotante "¡¡RETRUCO!!" en la pantalla
    canto_x, canto_y = phone_w // 2 - 90, felt_top + 265
    p_draw.rounded_rectangle([canto_x, canto_y, canto_x + 180, canto_y + 40], radius=16, fill=(220, 38, 38), outline=(254, 240, 138), width=2)
    p_draw.text((canto_x + 24, canto_y + 8), "¡¡RETRUCO!!", font=font_phone_title, fill=(255, 255, 255))
    
    # Botones inferiores del juego dentro del celular
    btn_y = felt_top + felt_h + 15
    # Botón Truco
    p_draw.rounded_rectangle([screen_margin + 20, btn_y, screen_margin + 130, btn_y + 38], radius=10, fill=(217, 119, 6))
    p_draw.text((screen_margin + 36, btn_y + 8), "¡QUIERO!", font=font_phone_btn, fill=(255, 255, 255))
    # Botón Envido
    p_draw.rounded_rectangle([screen_margin + 145, btn_y, screen_margin + 270, btn_y + 38], radius=10, fill=(154, 52, 18))
    p_draw.text((screen_margin + 160, btn_y + 8), "VALE 4", font=font_phone_btn, fill=(255, 255, 255))
    # Botón Señas
    p_draw.rounded_rectangle([screen_margin + 285, btn_y, screen_margin + 410, btn_y + 38], radius=10, fill=(30, 41, 59))
    p_draw.text((screen_margin + 300, btn_y + 8), "SEÑAS 🤫", font=font_phone_btn, fill=(253, 230, 138))
    # Botón Mazo
    p_draw.rounded_rectangle([screen_margin + 425, btn_y, screen_margin + 515, btn_y + 38], radius=10, fill=(88, 28, 28))
    p_draw.text((screen_margin + 440, btn_y + 8), "MAZO", font=font_phone_btn, fill=(254, 202, 202))
    
    story.paste(phone_img, (phone_x, phone_y), phone_img)

    # 4. CARTAS GRANDES ILUSTRADAS DEL TRUCO EN PRIMER PLANO (ABANICO 3D)
    # Mostramos los naipes más icónicos: As de Espadas, As de Bastos, 7 de Espadas, 7 de Oros
    card_scale_w = 260
    card_scale_h = 390
    
    cards_data = [
        ('oro_7.png', -20, W // 2 - 380, 930),
        ('basto_1.png', -8, W // 2 - 220, 910),
        ('espada_7.png', 18, W // 2 + 130, 930),
        ('espada_1.png', 5, W // 2 - 60, 890), # El As de Espadas al frente
    ]
    
    for c_file, rot, pos_x, pos_y in cards_data:
        try:
            c_img = Image.open(f'public/cards/{c_file}')
            c_res = c_img.resize((card_scale_w, card_scale_h), Image.Resampling.LANCZOS)
            
            # Sombra de la carta
            c_shadow = Image.new('RGBA', (card_scale_w + 30, card_scale_h + 30), (0, 0, 0, 0))
            cs_draw = ImageDraw.Draw(c_shadow)
            cs_draw.rounded_rectangle([10, 10, card_scale_w + 10, card_scale_h + 10], radius=18, fill=(0, 0, 0, 190))
            c_shadow = c_shadow.filter(ImageFilter.GaussianBlur(15))
            c_shadow_rot = c_shadow.rotate(rot, expand=True, resample=Image.Resampling.BICUBIC)
            
            # Rotar carta
            c_rot = c_res.rotate(rot, expand=True, resample=Image.Resampling.BICUBIC)
            
            # Pegar sombra y carta
            story.paste(c_shadow_rot, (pos_x - 10, pos_y + 10), c_shadow_rot)
            story.paste(c_rot, (pos_x, pos_y), c_rot.convert('RGBA'))
        except Exception as e:
            print(f'Error loading {c_file}:', e)

    # 5. LISTA DE CARACTERÍSTICAS / BADGES INFORMATIVOS
    features_y = 1320
    features = [
        ("👥 SALAS ONLINE", "Jugá 1v1, 2v2 (Parejas) o 3v3 (Tríos) con amigos"),
        ("🤫 SEÑAS SECRETAS", "Hacé señas criollas con tu compañero en vivo"),
        ("🃏 BARAJA 100% CRIOLLA", "Los 40 naipes ilustrados estilo litografía tradicional"),
        ("🎓 ESCUELA & VS INTELIGENCIA ARTIFICIAL", "Aprendé las señas, los tantos y practicá cuando quieras"),
    ]
    
    for i, (title_f, desc_f) in enumerate(features):
        fy = features_y + i * 88
        # Fondo del badge
        draw.rounded_rectangle([80, fy, W - 80, fy + 72], radius=18, fill=(28, 16, 9), outline=(180, 83, 9), width=2)
        # Ícono / Título
        draw.text((105, fy + 10), title_f, font=font_badge, fill=(251, 191, 36))
        # Descripción
        draw.text((105, fy + 38), desc_f, font=font_tag, fill=(245, 230, 205))

    # 6. LLAMADO A LA ACCIÓN (CALL TO ACTION) EN EL PIE
    cta_y = 1710
    cta_w = 900
    cta_h = 100
    cta_x = (W - cta_w) // 2
    
    # Resplandor del botón CTA
    btn_glow = Image.new('RGBA', (cta_w + 40, cta_h + 40), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(btn_glow)
    bg_draw.rounded_rectangle([10, 10, cta_w + 20, cta_h + 20], radius=32, fill=(16, 185, 129, 140))
    btn_glow = btn_glow.filter(ImageFilter.GaussianBlur(16))
    story.paste(btn_glow, (cta_x - 10, cta_y - 10), btn_glow)
    
    # Botón Principal Verde Esmeralda Criollo
    draw.rounded_rectangle([cta_x, cta_y, cta_x + cta_w, cta_y + cta_h], radius=28, fill=(5, 150, 105), outline=(110, 231, 183), width=3)
    
    cta_text = "👉 ¡TOCÁ EL LINK Y ENTRÁ A JUGAR!"
    c_box = draw.textbbox((0, 0), cta_text, font=font_cta)
    c_tw = c_box[2] - c_box[0]
    draw.text(((W - c_tw) // 2, cta_y + 26), cta_text, font=font_cta, fill=(255, 255, 255))
    
    # Subtexto final
    bot_text = "100% Web Gratis • Sin descargas • Directo en el celu o PC"
    b_box = draw.textbbox((0, 0), bot_text, font=font_tag)
    b_tw = b_box[2] - b_box[0]
    draw.text(((W - b_tw) // 2, cta_y + 115), bot_text, font=font_tag, fill=(217, 119, 6))

    output_path = 'public/historia_instagram_truco.png'
    story.save(output_path, quality=95)
    print(f'Imagen para Historia de Instagram guardada exitosamente en {output_path}')

if __name__ == '__main__':
    create_instagram_story()

