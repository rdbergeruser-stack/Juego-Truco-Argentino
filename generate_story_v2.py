import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_transparent_card(card_filename, target_w=340, target_h=520, corner_radius=22):
    """
    Carga un naipe de public/cards, recorta su cuerpo de papel y le aplica
    esquinas redondeadas con transparencia alfa perfecta (sin bordes blancos cuadrados).
    """
    img = Image.open(f'public/cards/{card_filename}').convert('RGBA')
    # El cuerpo del naipe está calibrado en (34, 32, 814, 1232)
    card_body = img.crop((34, 32, 814, 1232))
    
    # Redimensionar al tamaño deseado
    card_res = card_body.resize((target_w, target_h), Image.Resampling.LANCZOS)
    w, h = card_res.size
    
    # Crear máscara de esquinas redondeadas anti-aliasada
    mask = Image.new('L', (w * 2, h * 2), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([0, 0, w * 2, h * 2], radius=corner_radius * 2, fill=255)
    mask = mask.resize((w, h), Image.Resampling.LANCZOS)
    
    # Aplicar canal alfa
    card_res.putalpha(mask)
    return card_res

def add_drop_shadow(img, offset=(8, 12), blur=14, shadow_color=(0, 0, 0, 190)):
    """Genera una sombra suave y realista para cualquier imagen transparente."""
    w, h = img.size
    pad = blur * 3
    canvas = Image.new('RGBA', (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    
    # Extraer silueta de la máscara
    alpha = img.split()[-1]
    shadow_mask = Image.new('RGBA', img.size, shadow_color)
    shadow_mask.putalpha(alpha)
    
    canvas.paste(shadow_mask, (pad + offset[0], pad + offset[1]))
    canvas = canvas.filter(ImageFilter.GaussianBlur(blur))
    canvas.paste(img, (pad, pad), img)
    return canvas, pad

def generate_story():
    W, H = 1080, 1920
    story = Image.new('RGB', (W, H), (14, 8, 4))
    draw = ImageDraw.Draw(story)
    
    # FUENTES OFICIALES DEL SITIO (Cinzel y Lora)
    font_cinzel_black = ImageFont.truetype('fonts/Cinzel_900.ttf', 72)
    font_cinzel_bold = ImageFont.truetype('fonts/Cinzel_700.ttf', 38)
    font_cinzel_badge = ImageFont.truetype('fonts/Cinzel_700.ttf', 24)
    font_cinzel_cta = ImageFont.truetype('fonts/Cinzel_700.ttf', 36)
    
    font_lora_bold = ImageFont.truetype('fonts/Lora_700.ttf', 26)
    font_lora_title = ImageFont.truetype('fonts/Lora_700.ttf', 32)
    font_lora_desc = ImageFont.truetype('fonts/Lora_600.ttf', 22)
    font_phone_title = ImageFont.truetype('fonts/Cinzel_700.ttf', 20)
    font_phone_btn = ImageFont.truetype('fonts/Cinzel_700.ttf', 16)

    # 1. FONDO: MADERA DE PULPERÍA CON ATMÓSFERA DE CANDIL
    plank_h = 75
    for y in range(0, H, plank_h):
        c = (24 + (y % 6), 12 + (y % 4), 6 + (y % 3))
        draw.rectangle([0, y, W, y + plank_h], fill=c)
        draw.line([0, y, W, y], fill=(8, 4, 2), width=3)
        draw.line([0, y + 1, W, y + 1], fill=(42, 22, 10), width=1)
        
    # Gradiente cálido de iluminación de farol
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    cx, cy = W // 2, 720
    for r in range(850, 0, -25):
        alpha = int((1.0 - (r / 850.0)) * 145)
        g_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(245, 158, 11, alpha))
    story.paste(glow, (0, 0), glow)

    # 2. FOTO DE REFERENCIA (MANOS EN LA PULPERÍA) INTEGRADA
    ref_path = r'C:/Users/ID1539/.gemini/antigravity/brain/6ed69378-467c-4738-806b-142d07e352ac/.user_uploaded/media_1792586332929_213ec8bb.png'
    if os.path.exists(ref_path):
        ref_img = Image.open(ref_path).convert('RGBA')
        # Escalar para ocupar el ancho completo
        rw, rh = ref_img.size
        target_rw = W
        target_rh = int(rh * (W / rw))
        ref_scaled = ref_img.resize((target_rw, target_rh), Image.Resampling.LANCZOS)
        
        # Crear máscara de difuminado vertical en los bordes para fusionarse con los tablones
        ref_mask = Image.new('L', (target_rw, target_rh), 255)
        m_draw = ImageDraw.Draw(ref_mask)
        fade_h = 100
        for y in range(fade_h):
            a = int((y / float(fade_h)) * 255)
            m_draw.line([0, y, target_rw, y], fill=a)
            m_draw.line([0, target_rh - 1 - y, target_rw, target_rh - 1 - y], fill=a)
        
        # Pegar en la zona media
        ref_y = 480
        story.paste(ref_scaled.convert('RGB'), (0, ref_y), ref_mask)

    # 3. ENCABEZADO (SAFE ZONE DE INSTAGRAM STORIES: ARRIBA DE Y=100)
    # Badge de Bandera Argentina
    badge_text = "🇦🇷  EL TRUCO ARGENTINO ONLINE  🇦🇷"
    b_box = draw.textbbox((0, 0), badge_text, font=font_cinzel_badge)
    b_w = b_box[2] - b_box[0]
    bx = (W - b_w) // 2
    by = 95
    draw.rounded_rectangle([bx - 24, by - 8, bx + b_w + 24, by + 38], radius=16, fill=(15, 23, 42), outline=(56, 189, 248), width=2)
    draw.text((bx, by), badge_text, font=font_cinzel_badge, fill=(186, 230, 253))
    
    # Título Principal con tipografía CINZEL BLACK
    title_text = "TRUCO CRIOLLO"
    t_box = draw.textbbox((0, 0), title_text, font=font_cinzel_black)
    tw = t_box[2] - t_box[0]
    tx = (W - tw) // 2
    ty = 160
    # Sombra del título
    draw.text((tx + 4, ty + 5), title_text, font=font_cinzel_black, fill=(0, 0, 0))
    draw.text((tx, ty), title_text, font=font_cinzel_black, fill=(254, 240, 138))
    
    # Subtítulo Cinzel Bold
    sub_text = "¡JUGÁ CON TUS AMIGOS!"
    s_box = draw.textbbox((0, 0), sub_text, font=font_cinzel_bold)
    sw = s_box[2] - s_box[0]
    sx = (W - sw) // 2
    sy = 260
    draw.text((sx + 3, sy + 3), sub_text, font=font_cinzel_bold, fill=(0, 0, 0))
    draw.text((sx, sy), sub_text, font=font_cinzel_bold, fill=(245, 158, 11))
    
    # Píldora de modalidades (1v1, 2v2, 3v3)
    modes_text = "1 vs 1   •   2 vs 2 (Parejas)   •   3 vs 3 (Tríos)"
    m_box = draw.textbbox((0, 0), modes_text, font=font_lora_title)
    mw = m_box[2] - m_box[0]
    mx = (W - mw) // 2
    my = 330
    draw.rounded_rectangle([mx - 20, my - 6, mx + mw + 20, my + 42], radius=18, fill=(35, 18, 10, 230), outline=(217, 119, 6), width=2)
    draw.text((mx, my), modes_text, font=font_lora_title, fill=(254, 243, 199))

    # 4. LA MANO DE 3 CARTAS CON FONDO TRANSPARENTE EN PRIMER PLANO
    # Las 3 cartas más bravas: As de Espadas, 7 de Espadas, As de Bastos
    # o 7 de Espadas, As de Espadas (al centro), As de Bastos
    cw, ch = 330, 508
    card_left = create_transparent_card('espada_7.png', target_w=cw, target_h=ch, corner_radius=22)
    card_center = create_transparent_card('espada_1.png', target_w=cw, target_h=ch, corner_radius=22)
    card_right = create_transparent_card('basto_1.png', target_w=cw, target_h=ch, corner_radius=22)
    
    # Posiciones y ángulos en abanico natural de mano de Truco
    hand_y = 660
    
    # Carta Izquierda: 7 de Espadas (-14 grados)
    c1_rot = card_left.rotate(-14, expand=True, resample=Image.Resampling.BICUBIC)
    c1_comp, pad1 = add_drop_shadow(c1_rot, offset=(10, 16), blur=16, shadow_color=(0, 0, 0, 210))
    story.paste(c1_comp, (W // 2 - 380 - pad1, hand_y + 40 - pad1), c1_comp)
    
    # Carta Derecha: As de Bastos (+14 grados)
    c3_rot = card_right.rotate(14, expand=True, resample=Image.Resampling.BICUBIC)
    c3_comp, pad3 = add_drop_shadow(c3_rot, offset=(-8, 16), blur=16, shadow_color=(0, 0, 0, 210))
    story.paste(c3_comp, (W // 2 + 60 - pad3, hand_y + 40 - pad3), c3_comp)
    
    # Carta Central: El As de Espadas (El Macho) en el frente (0 grados)
    c2_rot = card_center.rotate(0, expand=True, resample=Image.Resampling.BICUBIC)
    c2_comp, pad2 = add_drop_shadow(c2_rot, offset=(0, 22), blur=20, shadow_color=(0, 0, 0, 240))
    story.paste(c2_comp, (W // 2 - (cw // 2) - pad2, hand_y - 25 - pad2), c2_comp)

    # 5. MOCKUP DE CELULAR FLOTANTE AL COSTADO MOSTRANDO LA MESA Y EL CANTO
    # Renderizamos la pantalla de juego en un mockup elegante
    phone_w, phone_h = 420, 270
    phone_x = 70
    phone_y = 1140
    
    phone_layer = Image.new('RGBA', (phone_w, phone_h), (0, 0, 0, 0))
    pl_draw = ImageDraw.Draw(phone_layer)
    # Marco de teléfono
    pl_draw.rounded_rectangle([0, 0, phone_w, phone_h], radius=24, fill=(24, 24, 27), outline=(217, 119, 6), width=3)
    # Paño verde
    pl_draw.rounded_rectangle([8, 8, phone_w - 8, phone_h - 8], radius=18, fill=(20, 83, 45), outline=(120, 53, 15), width=4)
    # Tanteador
    pl_draw.rounded_rectangle([20, 18, phone_w - 20, 56], radius=10, fill=(15, 23, 42, 230), outline=(245, 158, 11), width=1)
    pl_draw.text((32, 25), "NOSOTROS: 18 (Buenas)", font=font_phone_title, fill=(56, 189, 248))
    pl_draw.text((phone_w - 140, 25), "ELLOS: 14", font=font_phone_title, fill=(244, 63, 94))
    
    # Canto ¡¡TRUCO!!
    pl_draw.rounded_rectangle([phone_w // 2 - 80, 80, phone_w // 2 + 80, 125], radius=14, fill=(220, 38, 38), outline=(254, 240, 138), width=2)
    pl_draw.text((phone_w // 2 - 62, 88), "¡¡TRUCO!!", font=font_cinzel_badge, fill=(255, 255, 255))
    
    # Botones
    b_top = 180
    pl_draw.rounded_rectangle([20, b_top, 140, b_top + 40], radius=10, fill=(217, 119, 6))
    pl_draw.text((38, b_top + 10), "¡QUIERO!", font=font_phone_btn, fill=(255, 255, 255))
    
    pl_draw.rounded_rectangle([155, b_top, 275, b_top + 40], radius=10, fill=(30, 41, 59))
    pl_draw.text((170, b_top + 10), "SEÑAS 🤫", font=font_phone_btn, fill=(253, 230, 138))
    
    pl_draw.rounded_rectangle([290, b_top, 400, b_top + 40], radius=10, fill=(127, 29, 29))
    pl_draw.text((320, b_top + 10), "MAZO", font=font_phone_btn, fill=(254, 202, 202))
    
    phone_shadow = Image.new('RGBA', (phone_w + 30, phone_h + 30), (0, 0, 0, 0))
    ps_draw = ImageDraw.Draw(phone_shadow)
    ps_draw.rounded_rectangle([10, 10, phone_w + 10, phone_h + 10], radius=24, fill=(0, 0, 0, 180))
    phone_shadow = phone_shadow.filter(ImageFilter.GaussianBlur(15))
    
    story.paste(phone_shadow, (phone_x - 5, phone_y - 5), phone_shadow)
    story.paste(phone_layer, (phone_x, phone_y), phone_layer)

    # 6. CAJA DE SEÑAS Y CARACTERÍSTICAS
    feat_x = 520
    feat_y = 1130
    feat_w = W - feat_x - 70
    feat_h = 290
    
    draw.rounded_rectangle([feat_x, feat_y, feat_x + feat_w, feat_y + feat_h], radius=20, fill=(28, 15, 8, 240), outline=(180, 83, 9), width=2)
    
    # Título de características en Cinzel Bold
    draw.text((feat_x + 22, feat_y + 18), "CARACTERÍSTICAS", font=font_cinzel_badge, fill=(251, 191, 36))
    
    bullets = [
        ("🤫 Señas Secretas", "Enviá señas a tu compañero en tiempo real"),
        ("🃏 Baraja de 40 Naipes", "Ilustraciones auténticas de pulpería"),
        ("⚡ Conexión 4G / Wi-Fi", "Compartí link por WhatsApp y jugá al toque"),
        ("🎓 Escuela & vs IA", "Aprendé las reglas y entrená tu picardía"),
    ]
    
    for idx, (b_title, b_sub) in enumerate(bullets):
        by_pos = feat_y + 60 + idx * 54
        draw.text((feat_x + 22, by_pos), b_title, font=font_lora_bold, fill=(254, 240, 138))
        draw.text((feat_x + 22, by_pos + 24), b_sub, font=font_lora_desc, fill=(214, 211, 209))

    # 7. LLAMADO A LA ACCIÓN (CALL TO ACTION) EN EL PIE
    cta_w = 940
    cta_h = 105
    cta_x = (W - cta_w) // 2
    cta_y = 1680
    
    # Resplandor del botón
    cta_glow = Image.new('RGBA', (cta_w + 40, cta_h + 40), (0, 0, 0, 0))
    cg_draw = ImageDraw.Draw(cta_glow)
    cg_draw.rounded_rectangle([10, 10, cta_w + 20, cta_h + 20], radius=34, fill=(16, 185, 129, 160))
    cta_glow = cta_glow.filter(ImageFilter.GaussianBlur(18))
    story.paste(cta_glow, (cta_x - 10, cta_y - 10), cta_glow)
    
    # Botón Verde Esmeralda Criollo
    draw.rounded_rectangle([cta_x, cta_y, cta_x + cta_w, cta_y + cta_h], radius=30, fill=(4, 120, 87), outline=(52, 211, 153), width=3)
    
    cta_label = "👉 ¡TOCÁ EL LINK Y ENTRÁ A LA MESA!"
    cl_box = draw.textbbox((0, 0), cta_label, font=font_cinzel_cta)
    cl_w = cl_box[2] - cl_box[0]
    draw.text(((W - cl_w) // 2, cta_y + 32), cta_label, font=font_cinzel_cta, fill=(255, 255, 255))
    
    # Subtexto final Lora
    sub_foot = "100% Web Gratis • Sin Descargas • Directo en el Celular o PC"
    sf_box = draw.textbbox((0, 0), sub_foot, font=font_lora_bold)
    sf_w = sf_box[2] - sf_box[0]
    draw.text(((W - sf_w) // 2, cta_y + 124), sub_foot, font=font_lora_bold, fill=(245, 158, 11))

    output_path = 'public/historia_instagram_truco.png'
    story.save(output_path, quality=95)
    print(f'Historia de Instagram actualizada exitosamente en {output_path}!')

if __name__ == '__main__':
    generate_story()
