import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_transparent_card(card_filename, target_w=310, target_h=470, corner_radius=20):
    """
    Carga un naipe de public/cards, recorta su cuerpo de papel y le aplica
    esquinas redondeadas con transparencia alfa perfecta (sin bordes blancos cuadrados).
    """
    img = Image.open(f'public/cards/{card_filename}').convert('RGBA')
    # El cuerpo del naipe está calibrado en (34, 32, 814, 1232)
    card_body = img.crop((34, 32, 814, 1232))
    card_res = card_body.resize((target_w, target_h), Image.Resampling.LANCZOS)
    w, h = card_res.size
    
    # Máscara de esquinas redondeadas anti-aliasada
    mask = Image.new('L', (w * 2, h * 2), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([0, 0, w * 2, h * 2], radius=corner_radius * 2, fill=255)
    mask = mask.resize((w, h), Image.Resampling.LANCZOS)
    
    card_res.putalpha(mask)
    return card_res

def add_drop_shadow(img, offset=(8, 14), blur=16, shadow_color=(0, 0, 0, 220)):
    w, h = img.size
    pad = blur * 3
    canvas = Image.new('RGBA', (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    alpha = img.split()[-1]
    shadow_mask = Image.new('RGBA', img.size, shadow_color)
    shadow_mask.putalpha(alpha)
    
    canvas.paste(shadow_mask, (pad + offset[0], pad + offset[1]))
    canvas = canvas.filter(ImageFilter.GaussianBlur(blur))
    canvas.paste(img, (pad, pad), img)
    return canvas, pad

def make_suit_icon(suit_name, target_size=46):
    """Genera un medallón circular elegante con la ilustración real de cada palo."""
    badge = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge)
    
    # Anillo exterior dorado
    b_draw.ellipse([0, 0, target_size - 1, target_size - 1], fill=(38, 18, 8), outline=(245, 158, 11), width=2)
    # Fondo pergamino interior
    pad = 3
    b_draw.ellipse([pad, pad, target_size - 1 - pad, target_size - 1 - pad], fill=(245, 237, 224))
    
    if suit_name == 'oro':
        # Moneda de oro
        o4 = Image.open('public/cards/oro_4.png')
        coin = o4.crop((190, 210, 370, 390))
        coin_res = coin.resize((target_size - 8, target_size - 8), Image.Resampling.LANCZOS).convert('RGBA')
        mask = Image.new('L', (target_size - 8, target_size - 8), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, target_size - 9, target_size - 9], fill=255)
        badge.paste(coin_res, (4, 4), mask)
        
    elif suit_name == 'copa':
        # Copa dorada
        c4 = Image.open('public/cards/copa_4.png')
        cup = c4.crop((190, 210, 370, 420))
        cw, ch = 32, 36
        cup_res = cup.resize((cw, ch), Image.Resampling.LANCZOS).convert('RGBA')
        badge.paste(cup_res, ((target_size - cw) // 2, (target_size - ch) // 2), cup_res)
        
    elif suit_name == 'espada':
        # Espada cruzada en diagonal
        e4 = Image.open('public/cards/espada_4.png')
        sword = e4.crop((185, 185, 315, 495))
        sword_rot = sword.rotate(45, expand=True, resample=Image.Resampling.BICUBIC)
        sw, sh = 34, 34
        sword_res = sword_rot.resize((sw, sh), Image.Resampling.LANCZOS).convert('RGBA')
        badge.paste(sword_res, ((target_size - sw) // 2, (target_size - sh) // 2), sword_res)
        
    elif suit_name == 'basto':
        # Basto cruzado en diagonal
        b4 = Image.open('public/cards/basto_4.png')
        club = b4.crop((185, 185, 315, 495))
        club_rot = club.rotate(-45, expand=True, resample=Image.Resampling.BICUBIC)
        bw, bh = 34, 34
        club_res = club_rot.resize((bw, bh), Image.Resampling.LANCZOS).convert('RGBA')
        badge.paste(club_res, ((target_size - bw) // 2, (target_size - bh) // 2), club_res)
        
    return badge

def generate_story():
    W, H = 1080, 1920
    story = Image.new('RGB', (W, H), (14, 8, 4))
    draw = ImageDraw.Draw(story)
    
    # TIPOGRAFÍAS OFICIALES DEL SITIO WEB (Cinzel y Lora)
    font_cinzel_black = ImageFont.truetype('fonts/Cinzel_900.ttf', 68)
    font_cinzel_bold = ImageFont.truetype('fonts/Cinzel_700.ttf', 36)
    font_cinzel_badge = ImageFont.truetype('fonts/Cinzel_700.ttf', 22)
    font_cinzel_card = ImageFont.truetype('fonts/Cinzel_700.ttf', 26)
    font_cinzel_cta = ImageFont.truetype('fonts/Cinzel_700.ttf', 36)
    
    font_lora_bold = ImageFont.truetype('fonts/Lora_700.ttf', 25)
    font_lora_title = ImageFont.truetype('fonts/Lora_700.ttf', 28)
    font_lora_desc = ImageFont.truetype('fonts/Lora_600.ttf', 20)

    # 1. FONDO DE PULPERÍA (TABLONES DE QUEBRACHO)
    plank_h = 75
    for y in range(0, H, plank_h):
        c = (24 + (y % 6), 12 + (y % 4), 6 + (y % 3))
        draw.rectangle([0, y, W, y + plank_h], fill=c)
        draw.line([0, y, W, y], fill=(8, 4, 2), width=3)
        draw.line([0, y + 1, W, y + 1], fill=(42, 22, 10), width=1)
        
    # Resplandor de farol central
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    cx, cy = W // 2, 650
    for r in range(900, 0, -25):
        alpha = int((1.0 - (r / 900.0)) * 145)
        g_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(245, 158, 11, alpha))
    story.paste(glow, (0, 0), glow)

    # 2. FOTO DE REFERENCIA (MANOS EN LA TABERNA)
    ref_path = r'C:/Users/ID1539/.gemini/antigravity/brain/6ed69378-467c-4738-806b-142d07e352ac/.user_uploaded/media_1792586332929_213ec8bb.png'
    if os.path.exists(ref_path):
        ref_img = Image.open(ref_path).convert('RGBA')
        rw, rh = ref_img.size
        target_rw = W
        target_rh = int(rh * (W / rw))
        ref_scaled = ref_img.resize((target_rw, target_rh), Image.Resampling.LANCZOS)
        
        # Máscara de difuminado suave en extremos
        ref_mask = Image.new('L', (target_rw, target_rh), 255)
        m_draw = ImageDraw.Draw(ref_mask)
        fade_h = 90
        for y in range(fade_h):
            a = int((y / float(fade_h)) * 255)
            m_draw.line([0, y, target_rw, y], fill=a)
            m_draw.line([0, target_rh - 1 - y, target_rw, target_rh - 1 - y], fill=a)
        
        ref_y = 410
        story.paste(ref_scaled.convert('RGB'), (0, ref_y), ref_mask)

    # 3. ENCABEZADO SUPERIOR
    # Badge superior
    badge_text = "🇦🇷  EL JUEGO NACIONAL ARGENTINO  🇦🇷"
    b_box = draw.textbbox((0, 0), badge_text, font=font_cinzel_badge)
    b_w = b_box[2] - b_box[0]
    bx = (W - b_w) // 2
    by = 80
    draw.rounded_rectangle([bx - 22, by - 6, bx + b_w + 22, by + 36], radius=16, fill=(15, 23, 42), outline=(56, 189, 248), width=2)
    draw.text((bx, by), badge_text, font=font_cinzel_badge, fill=(186, 230, 253))
    
    # Título Principal con tipografía CINZEL BLACK
    title_text = "TRUCO CRIOLLO"
    t_box = draw.textbbox((0, 0), title_text, font=font_cinzel_black)
    tw = t_box[2] - t_box[0]
    tx = (W - tw) // 2
    ty = 138
    draw.text((tx + 4, ty + 5), title_text, font=font_cinzel_black, fill=(0, 0, 0))
    draw.text((tx, ty), title_text, font=font_cinzel_black, fill=(254, 240, 138))
    
    # Subtítulo Cinzel Bold
    sub_text = "¡JUGÁ CON AMIGOS O CONTRA LA PC!"
    s_box = draw.textbbox((0, 0), sub_text, font=font_cinzel_bold)
    sw = s_box[2] - s_box[0]
    sx = (W - sw) // 2
    sy = 230
    draw.text((sx + 3, sy + 3), sub_text, font=font_cinzel_bold, fill=(0, 0, 0))
    draw.text((sx, sy), sub_text, font=font_cinzel_bold, fill=(245, 158, 11))
    
    # Píldora de modalidades
    modes_text = "1 vs 1   •   2 vs 2 (Parejas)   •   3 vs 3 (Tríos)"
    m_box = draw.textbbox((0, 0), modes_text, font=font_lora_title)
    mw = m_box[2] - m_box[0]
    mx = (W - mw) // 2
    my = 295
    draw.rounded_rectangle([mx - 20, my - 6, mx + mw + 20, my + 40], radius=18, fill=(35, 18, 10, 230), outline=(217, 119, 6), width=2)
    draw.text((mx, my), modes_text, font=font_lora_title, fill=(254, 243, 199))

    # 4. LA MANO DE 3 CARTAS CON FONDO TRANSPARENTE EN PRIMER PLANO
    # Exactamente 3 cartas: 7 de Espadas, As de Espadas (al frente), As de Bastos
    cw, ch = 310, 470
    card_left = create_transparent_card('espada_7.png', target_w=cw, target_h=ch, corner_radius=20)
    card_center = create_transparent_card('espada_1.png', target_w=cw, target_h=ch, corner_radius=20)
    card_right = create_transparent_card('basto_1.png', target_w=cw, target_h=ch, corner_radius=20)
    
    hand_y = 570
    
    # Carta Izquierda: 7 de Espadas (-14°)
    c1_rot = card_left.rotate(-14, expand=True, resample=Image.Resampling.BICUBIC)
    c1_comp, pad1 = add_drop_shadow(c1_rot, offset=(10, 16), blur=16, shadow_color=(0, 0, 0, 210))
    story.paste(c1_comp, (W // 2 - 355 - pad1, hand_y + 40 - pad1), c1_comp)
    
    # Carta Derecha: As de Bastos (+14°)
    c3_rot = card_right.rotate(14, expand=True, resample=Image.Resampling.BICUBIC)
    c3_comp, pad3 = add_drop_shadow(c3_rot, offset=(-8, 16), blur=16, shadow_color=(0, 0, 0, 210))
    story.paste(c3_comp, (W // 2 + 50 - pad3, hand_y + 40 - pad3), c3_comp)
    
    # Carta Central: As de Espadas (0°) al frente
    c2_rot = card_center.rotate(0, expand=True, resample=Image.Resampling.BICUBIC)
    c2_comp, pad2 = add_drop_shadow(c2_rot, offset=(0, 22), blur=20, shadow_color=(0, 0, 0, 240))
    story.paste(c2_comp, (W // 2 - (cw // 2) - pad2, hand_y - 25 - pad2), c2_comp)

    # 5. RECUADRO IZQUIERDO: PANTALLA REAL DE JUEGO (REPLICA EXACTA)
    phone_pad = 12
    screen_w = 328
    screen_h = 650
    phone_w = screen_w + phone_pad * 2
    phone_h = screen_h + phone_pad * 2
    phone_x = 50
    phone_y = 980
    
    phone_frame = Image.new('RGBA', (phone_w, phone_h), (0, 0, 0, 0))
    pf_draw = ImageDraw.Draw(phone_frame)
    pf_draw.rounded_rectangle([0, 0, phone_w, phone_h], radius=32, fill=(24, 24, 27), outline=(217, 119, 6), width=3)
    
    # Captura real del juego
    game_screenshot_path = r'C:/Users/ID1539/.gemini/antigravity/brain/6ed69378-467c-4738-806b-142d07e352ac/.user_uploaded/media_1792587208105_581af75c.jpg'
    if os.path.exists(game_screenshot_path):
        real_sc = Image.open(game_screenshot_path)
        clean_game_ui = real_sc.crop((0, 116, 449, 1005))
        ui_res = clean_game_ui.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
        
        ui_mask = Image.new('L', (screen_w * 2, screen_h * 2), 0)
        uim_draw = ImageDraw.Draw(ui_mask)
        uim_draw.rounded_rectangle([0, 0, screen_w * 2, screen_h * 2], radius=36, fill=255)
        ui_mask = ui_mask.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
        
        phone_frame.paste(ui_res, (phone_pad, phone_pad), ui_mask)
        
    p_shadow = Image.new('RGBA', (phone_w + 30, phone_h + 30), (0, 0, 0, 0))
    ps_draw = ImageDraw.Draw(p_shadow)
    ps_draw.rounded_rectangle([10, 10, phone_w + 10, phone_h + 10], radius=32, fill=(0, 0, 0, 210))
    p_shadow = p_shadow.filter(ImageFilter.GaussianBlur(16))
    
    story.paste(p_shadow, (phone_x - 5, phone_y - 5), p_shadow)
    story.paste(phone_frame, (phone_x, phone_y), phone_frame)
    
    # Etiqueta sobre el teléfono
    m_label = "PANTALLA REAL EN VIVO"
    ml_box = draw.textbbox((0, 0), m_label, font=font_cinzel_badge)
    ml_w = ml_box[2] - ml_box[0]
    draw.rounded_rectangle([phone_x + (phone_w - ml_w) // 2 - 16, phone_y - 18, phone_x + (phone_w + ml_w) // 2 + 16, phone_y + 14], radius=10, fill=(217, 119, 6), outline=(254, 240, 138), width=2)
    draw.text((phone_x + (phone_w - ml_w) // 2, phone_y - 14), m_label, font=font_cinzel_badge, fill=(20, 10, 5))

    # 6. RECUADRO DERECHO: LAS 4 CARACTERÍSTICAS CON LOS 4 PALOS DE LA BARAJA
    feat_x = 432
    feat_y = 980
    feat_w = 598
    feat_h = phone_h  # Exactamente la misma altura (674px)
    
    f_shadow = Image.new('RGBA', (feat_w + 30, feat_h + 30), (0, 0, 0, 0))
    fs_draw = ImageDraw.Draw(f_shadow)
    fs_draw.rounded_rectangle([10, 10, feat_w + 10, feat_h + 10], radius=26, fill=(0, 0, 0, 200))
    f_shadow = f_shadow.filter(ImageFilter.GaussianBlur(16))
    story.paste(f_shadow, (feat_x - 5, feat_y - 5), f_shadow)
    
    # Panel de madera con bisel dorado
    draw.rounded_rectangle([feat_x, feat_y, feat_x + feat_w, feat_y + feat_h], radius=26, fill=(26, 13, 7), outline=(217, 119, 6), width=2)
    
    # Encabezado del panel
    draw.text((feat_x + 32, feat_y + 28), "LO QUE ENCONTRÁS:", font=font_cinzel_card, fill=(251, 191, 36))
    draw.line([feat_x + 32, feat_y + 68, feat_x + feat_w - 32, feat_y + 68], fill=(180, 83, 9), width=1)
    
    # LAS 4 CARACTERÍSTICAS CLAVE ASOCIADAS CADA UNA A UN PALO REAL:
    # 1. Espadas -> Te enseña a jugar
    # 2. Bastos -> Vs la computadora
    # 3. Oros -> Con amigos online
    # 4. Copas -> Baraja criolla de 40
    key_features = [
        ('espada', "TE ENSEÑA A JUGAR", "Escuela interactiva paso a paso con las cartas bravas, el tanteo del envido y cómo mentir."),
        ('basto', "VS LA COMPUTADORA", "Jugá partidas rápidas en tu celu o compu contra la inteligencia artificial (3 dificultades)."),
        ('oro', "CON AMIGOS ONLINE", "Creá tu sala, pasales el link por WhatsApp y jueguen 1v1, en parejas o en tríos."),
        ('copa', "BARAJA CRIOLLA DE 40", "Los 40 naipes dibujados a mano con el estilo litográfico tradicional de pulpería."),
    ]
    
    item_y = feat_y + 88
    badge_size = 48
    
    for suit_name, title_k, desc_k in key_features:
        # Generar medallón con el palo de la baraja
        suit_badge = make_suit_icon(suit_name, target_size=badge_size)
        story.paste(suit_badge, (feat_x + 24, item_y + 4), suit_badge)
        
        # Título en Lora Bold (con sangría para el icono del palo)
        text_x = feat_x + 24 + badge_size + 16
        draw.text((text_x, item_y), title_k, font=font_lora_bold, fill=(254, 240, 138))
        
        # Descripción en Lora Regular con wrap automático
        max_desc_w = feat_w - (badge_size + 16 + 48)
        words = desc_k.split(' ')
        line1, line2 = '', ''
        for w in words:
            test_line = (line1 + ' ' + w).strip()
            tb = draw.textbbox((0, 0), test_line, font=font_lora_desc)
            if (tb[2] - tb[0]) < max_desc_w and not line2:
                line1 = test_line
            else:
                line2 = (line2 + ' ' + w).strip()
                
        draw.text((text_x, item_y + 36), line1, font=font_lora_desc, fill=(214, 211, 209))
        if line2:
            draw.text((text_x, item_y + 64), line2, font=font_lora_desc, fill=(214, 211, 209))
            
        item_y += 135

    # 7. LLAMADO A LA ACCIÓN (CALL TO ACTION) EN EL PIE
    cta_w = 980
    cta_h = 100
    cta_x = (W - cta_w) // 2
    cta_y = 1695
    
    cta_glow = Image.new('RGBA', (cta_w + 40, cta_h + 40), (0, 0, 0, 0))
    cg_draw = ImageDraw.Draw(cta_glow)
    cg_draw.rounded_rectangle([10, 10, cta_w + 20, cta_h + 20], radius=34, fill=(16, 185, 129, 160))
    cta_glow = cta_glow.filter(ImageFilter.GaussianBlur(18))
    story.paste(cta_glow, (cta_x - 10, cta_y - 10), cta_glow)
    
    draw.rounded_rectangle([cta_x, cta_y, cta_x + cta_w, cta_y + cta_h], radius=28, fill=(4, 120, 87), outline=(52, 211, 153), width=3)
    
    cta_label = "👉 ¡TOCÁ EL LINK Y ENTRÁ A LA MESA!"
    cl_box = draw.textbbox((0, 0), cta_label, font=font_cinzel_cta)
    cl_w = cl_box[2] - cl_box[0]
    draw.text(((W - cl_w) // 2, cta_y + 30), cta_label, font=font_cinzel_cta, fill=(255, 255, 255))
    
    sub_foot = "100% Web Gratis • Sin Descargas • Jugá en el Celular o PC"
    sf_box = draw.textbbox((0, 0), sub_foot, font=font_lora_bold)
    sf_w = sf_box[2] - sf_box[0]
    draw.text(((W - sf_w) // 2, cta_y + 120), sub_foot, font=font_lora_bold, fill=(245, 158, 11))

    output_path = 'public/historia_instagram_truco.png'
    story.save(output_path, quality=95)
    print(f'Historia de Instagram actualizada exitosamente en {output_path}!')

if __name__ == '__main__':
    generate_story()
