import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_transparent_card(card_filename, target_w=310, target_h=470, corner_radius=20):
    """
    Carga un naipe de public/cards, recorta su cuerpo de papel y le aplica
    esquinas redondeadas con transparencia alfa perfecta.
    """
    img = Image.open(f'public/cards/{card_filename}').convert('RGBA')
    card_body = img.crop((34, 32, 814, 1232))
    card_res = card_body.resize((target_w, target_h), Image.Resampling.LANCZOS)
    w, h = card_res.size
    
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

def draw_matchsticks(draw, x, y, count=5, color=(245, 158, 11)):
    """Dibuja un paquetito criollo tradicional de 5 fósforos para el tanteador."""
    # 4 fósforos verticales
    for i in range(min(count, 4)):
        fx = x + i * 7
        draw.line([fx, y, fx, y + 20], fill=color, width=2)
        # Cabeza del fósforo (rojo/pólvora)
        draw.ellipse([fx - 1, y - 2, fx + 2, y + 2], fill=(220, 38, 38))
    # 5to fósforo cruzado en diagonal
    if count >= 5:
        draw.line([x - 2, y + 18, x + 24, y + 2], fill=(251, 191, 36), width=2)

def generate_story():
    W, H = 1080, 1920
    story = Image.new('RGB', (W, H), (14, 8, 4))
    draw = ImageDraw.Draw(story)
    
    # TIPOGRAFÍAS DEL SITIO
    font_cinzel_black = ImageFont.truetype('fonts/Cinzel_900.ttf', 68)
    font_cinzel_bold = ImageFont.truetype('fonts/Cinzel_700.ttf', 36)
    font_cinzel_badge = ImageFont.truetype('fonts/Cinzel_700.ttf', 22)
    font_cinzel_card = ImageFont.truetype('fonts/Cinzel_700.ttf', 24)
    font_cinzel_cta = ImageFont.truetype('fonts/Cinzel_700.ttf', 36)
    
    font_lora_bold = ImageFont.truetype('fonts/Lora_700.ttf', 24)
    font_lora_title = ImageFont.truetype('fonts/Lora_700.ttf', 28)
    font_lora_desc = ImageFont.truetype('fonts/Lora_600.ttf', 19)
    font_mini_bold = ImageFont.truetype('fonts/Cinzel_700.ttf', 15)
    font_mini_text = ImageFont.truetype('fonts/Lora_700.ttf', 14)

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
    cx, cy = W // 2, 680
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
        
        ref_y = 440
        story.paste(ref_scaled.convert('RGB'), (0, ref_y), ref_mask)

    # 3. ENCABEZADO SUPERIOR
    # Badge superior
    badge_text = "🇦🇷  EL JUEGO NACIONAL ARGENTINO  🇦🇷"
    b_box = draw.textbbox((0, 0), badge_text, font=font_cinzel_badge)
    b_w = b_box[2] - b_box[0]
    bx = (W - b_w) // 2
    by = 85
    draw.rounded_rectangle([bx - 22, by - 6, bx + b_w + 22, by + 36], radius=16, fill=(15, 23, 42), outline=(56, 189, 248), width=2)
    draw.text((bx, by), badge_text, font=font_cinzel_badge, fill=(186, 230, 253))
    
    # Título Principal "TRUCO CRIOLLO"
    title_text = "TRUCO CRIOLLO"
    t_box = draw.textbbox((0, 0), title_text, font=font_cinzel_black)
    tw = t_box[2] - t_box[0]
    tx = (W - tw) // 2
    ty = 145
    draw.text((tx + 4, ty + 5), title_text, font=font_cinzel_black, fill=(0, 0, 0))
    draw.text((tx, ty), title_text, font=font_cinzel_black, fill=(254, 240, 138))
    
    # Subtítulo Cinzel Bold
    sub_text = "¡JUGÁ CON AMIGOS O CONTRA LA PC!"
    s_box = draw.textbbox((0, 0), sub_text, font=font_cinzel_bold)
    sw = s_box[2] - s_box[0]
    sx = (W - sw) // 2
    sy = 240
    draw.text((sx + 3, sy + 3), sub_text, font=font_cinzel_bold, fill=(0, 0, 0))
    draw.text((sx, sy), sub_text, font=font_cinzel_bold, fill=(245, 158, 11))
    
    # Modalidades
    modes_text = "1 vs 1   •   2 vs 2 (Parejas)   •   3 vs 3 (Tríos)"
    m_box = draw.textbbox((0, 0), modes_text, font=font_lora_title)
    mw = m_box[2] - m_box[0]
    mx = (W - mw) // 2
    my = 305
    draw.rounded_rectangle([mx - 20, my - 6, mx + mw + 20, my + 40], radius=18, fill=(35, 18, 10, 230), outline=(217, 119, 6), width=2)
    draw.text((mx, my), modes_text, font=font_lora_title, fill=(254, 243, 199))

    # 4. LA MANO DE 3 CARTAS CON FONDO TRANSPARENTE EN PRIMER PLANO
    # Exactamente 3 cartas: 7 de Espadas, As de Espadas, As de Bastos
    cw, ch = 320, 490
    card_left = create_transparent_card('espada_7.png', target_w=cw, target_h=ch, corner_radius=20)
    card_center = create_transparent_card('espada_1.png', target_w=cw, target_h=ch, corner_radius=20)
    card_right = create_transparent_card('basto_1.png', target_w=cw, target_h=ch, corner_radius=20)
    
    hand_y = 610
    
    # Carta Izquierda: 7 de Espadas (-14°)
    c1_rot = card_left.rotate(-14, expand=True, resample=Image.Resampling.BICUBIC)
    c1_comp, pad1 = add_drop_shadow(c1_rot, offset=(10, 16), blur=16, shadow_color=(0, 0, 0, 210))
    story.paste(c1_comp, (W // 2 - 365 - pad1, hand_y + 40 - pad1), c1_comp)
    
    # Carta Derecha: As de Bastos (+14°)
    c3_rot = card_right.rotate(14, expand=True, resample=Image.Resampling.BICUBIC)
    c3_comp, pad3 = add_drop_shadow(c3_rot, offset=(-8, 16), blur=16, shadow_color=(0, 0, 0, 210))
    story.paste(c3_comp, (W // 2 + 55 - pad3, hand_y + 40 - pad3), c3_comp)
    
    # Carta Central: As de Espadas (0°) al frente
    c2_rot = card_center.rotate(0, expand=True, resample=Image.Resampling.BICUBIC)
    c2_comp, pad2 = add_drop_shadow(c2_rot, offset=(0, 22), blur=20, shadow_color=(0, 0, 0, 240))
    story.paste(c2_comp, (W // 2 - (cw // 2) - pad2, hand_y - 25 - pad2), c2_comp)

    # 5. RECUADRO IZQUIERDO: PANTALLA REAL DE JUEGO (MESA CON CARTAS EN JUEGO)
    # Dimensiones y posición del mockup
    mock_w, mock_h = 470, 560
    mock_x = 45
    mock_y = 1070
    
    mockup = Image.new('RGBA', (mock_w, mock_h), (0, 0, 0, 0))
    m_draw = ImageDraw.Draw(mockup)
    
    # Marco de dispositivo pulido
    m_draw.rounded_rectangle([0, 0, mock_w, mock_h], radius=28, fill=(24, 24, 27), outline=(217, 119, 6), width=3)
    
    # Interior de la pantalla: Paño verde con marco de madera
    screen_pad = 10
    m_draw.rounded_rectangle([screen_pad, screen_pad, mock_w - screen_pad, mock_h - screen_pad], radius=20, fill=(18, 10, 5))
    
    # Tanteador Criollo Real (Arriba de la mesa)
    score_y = screen_pad + 8
    score_h = 60
    m_draw.rounded_rectangle([screen_pad + 6, score_y, mock_w - screen_pad - 6, score_y + score_h], radius=12, fill=(15, 23, 42, 240), outline=(180, 83, 9), width=1)
    
    # Datos de puntaje y fósforos
    m_draw.text((score_y + 10, score_y + 8), "VOS: 14 pts (Buenas)", font=font_mini_text, fill=(56, 189, 248))
    draw_matchsticks(m_draw, score_y + 12, score_y + 30, count=5, color=(56, 189, 248))
    draw_matchsticks(m_draw, score_y + 44, score_y + 30, count=5, color=(56, 189, 248))
    draw_matchsticks(m_draw, score_y + 76, score_y + 30, count=4, color=(56, 189, 248))
    
    m_draw.text((mock_w - 200, score_y + 8), "RIVAL: 11 pts", font=font_mini_text, fill=(244, 63, 94))
    draw_matchsticks(m_draw, mock_w - 195, score_y + 30, count=5, color=(244, 63, 94))
    draw_matchsticks(m_draw, mock_w - 163, score_y + 30, count=5, color=(244, 63, 94))
    draw_matchsticks(m_draw, mock_w - 131, score_y + 30, count=1, color=(244, 63, 94))
    
    # Mesa de paño verde real
    table_top = score_y + score_h + 8
    table_h = mock_h - table_top - 65
    m_draw.rounded_rectangle([screen_pad + 6, table_top, mock_w - screen_pad - 6, table_top + table_h], radius=18, fill=(20, 83, 45), outline=(120, 53, 15), width=6)
    
    # 1. ZONA RIVAL (ARRIBA EN LA MESA)
    # Avatar y nombre del rival
    m_draw.ellipse([mock_w // 2 - 110, table_top + 10, mock_w // 2 - 70, table_top + 50], fill=(45, 25, 12), outline=(245, 158, 11), width=1)
    m_draw.text((mock_w // 2 - 102, table_top + 16), "🤠", font=font_mini_text)
    m_draw.text((mock_w // 2 - 60, table_top + 15), "Don Facundo (Rival)", font=font_mini_text, fill=(254, 243, 199))
    
    # Cartas boca abajo que le quedan al rival (2 cartas)
    for i in range(2):
        bx_pos = mock_w // 2 - 60 + i * 22
        m_draw.rounded_rectangle([bx_pos, table_top + 34, bx_pos + 18, table_top + 58], radius=3, fill=(120, 53, 15), outline=(245, 158, 11), width=1)
        
    # 2. CARTAS EN JUEGO EN EL CENTRO DE LA MESA (DE AMBOS LADOS)
    try:
        # Carta jugada por el Rival: 7 de Copas
        card_rival = create_transparent_card('copa_7.png', target_w=95, target_h=145, corner_radius=8)
        c_rival_rot = card_rival.rotate(-8, expand=True)
        mockup.paste(c_rival_rot, (mock_w // 2 - 115, table_top + 85), c_rival_rot)
        
        # Carta jugada por Vos: As de Espadas (matando la baza)
        card_vos = create_transparent_card('espada_1.png', target_w=95, target_h=145, corner_radius=8)
        c_vos_rot = card_vos.rotate(10, expand=True)
        mockup.paste(c_vos_rot, (mock_w // 2 + 10, table_top + 95), c_vos_rot)
    except Exception as e:
        print('Error drawing played cards in mockup:', e)
        
    # Canto activo flotante en la mesa: ¡¡TRUCO!!
    canto_x = mock_w // 2 - 70
    canto_y = table_top + 180
    m_draw.rounded_rectangle([canto_x, canto_y, canto_x + 140, canto_y + 36], radius=12, fill=(220, 38, 38), outline=(254, 240, 138), width=2)
    m_draw.text((canto_x + 22, canto_y + 7), "¡¡TRUCO!!", font=font_mini_bold, fill=(255, 255, 255))
    
    # 3. ZONA INFERIOR: TUS CARTAS EN MANO Y BOTONES REALES
    btn_y = table_top + table_h + 10
    
    # Botón Quiero
    m_draw.rounded_rectangle([screen_pad + 10, btn_y, screen_pad + 115, btn_y + 38], radius=10, fill=(217, 119, 6))
    m_draw.text((screen_pad + 28, btn_y + 9), "QUIERO", font=font_mini_bold, fill=(255, 255, 255))
    
    # Botón Envido
    m_draw.rounded_rectangle([screen_pad + 125, btn_y, screen_pad + 230, btn_y + 38], radius=10, fill=(154, 52, 18))
    m_draw.text((screen_pad + 140, btn_y + 9), "ENVIDO", font=font_mini_bold, fill=(255, 255, 255))
    
    # Botón Vale 4
    m_draw.rounded_rectangle([screen_pad + 240, btn_y, screen_pad + 345, btn_y + 38], radius=10, fill=(185, 28, 28))
    m_draw.text((screen_pad + 252, btn_y + 9), "RETRUCO", font=font_mini_bold, fill=(255, 255, 255))
    
    # Botón Mazo
    m_draw.rounded_rectangle([screen_pad + 355, btn_y, mock_w - screen_pad - 10, btn_y + 38], radius=10, fill=(60, 20, 20))
    m_draw.text((screen_pad + 368, btn_y + 9), "MAZO", font=font_mini_bold, fill=(254, 202, 202))
    
    # Sombra del teléfono
    m_shadow = Image.new('RGBA', (mock_w + 30, mock_h + 30), (0, 0, 0, 0))
    ms_draw = ImageDraw.Draw(m_shadow)
    ms_draw.rounded_rectangle([10, 10, mock_w + 10, mock_h + 10], radius=28, fill=(0, 0, 0, 210))
    m_shadow = m_shadow.filter(ImageFilter.GaussianBlur(16))
    
    story.paste(m_shadow, (mock_x - 5, mock_y - 5), m_shadow)
    story.paste(mockup, (mock_x, mock_y), mockup)
    
    # Etiqueta sobre el mockup
    m_label = "MESA REAL EN VIVO"
    ml_box = draw.textbbox((0, 0), m_label, font=font_cinzel_badge)
    ml_w = ml_box[2] - ml_box[0]
    draw.rounded_rectangle([mock_x + (mock_w - ml_w) // 2 - 16, mock_y - 18, mock_x + (mock_w + ml_w) // 2 + 16, mock_y + 14], radius=10, fill=(217, 119, 6), outline=(254, 240, 138), width=2)
    draw.text((mock_x + (mock_w - ml_w) // 2, mock_y - 14), m_label, font=font_cinzel_badge, fill=(20, 10, 5))

    # 6. RECUADRO DERECHO: LAS 4 CARACTERÍSTICAS EXACTAS QUE PIDIÓ EL USUARIO
    feat_x = 550
    feat_y = 1070
    feat_w = W - feat_x - 45
    feat_h = 560
    
    # Sombra del panel derecho
    f_shadow = Image.new('RGBA', (feat_w + 30, feat_h + 30), (0, 0, 0, 0))
    fs_draw = ImageDraw.Draw(f_shadow)
    fs_draw.rounded_rectangle([10, 10, feat_w + 10, feat_h + 10], radius=24, fill=(0, 0, 0, 200))
    f_shadow = f_shadow.filter(ImageFilter.GaussianBlur(16))
    story.paste(f_shadow, (feat_x - 5, feat_y - 5), f_shadow)
    
    # Panel de madera oscura con marco dorado
    draw.rounded_rectangle([feat_x, feat_y, feat_x + feat_w, feat_y + feat_h], radius=24, fill=(26, 13, 7), outline=(217, 119, 6), width=2)
    
    # Encabezado del panel
    draw.text((feat_x + 30, feat_y + 24), "LO QUE ENCONTRÁS:", font=font_cinzel_card, fill=(251, 191, 36))
    draw.line([feat_x + 30, feat_y + 60, feat_x + feat_w - 30, feat_y + 60], fill=(180, 83, 9), width=1)
    
    # LAS 4 CARACTERÍSTICAS CLAVE PEDIDAS:
    key_features = [
        ("🎓 TE ENSEÑA A JUGAR", "Escuela interactiva paso a paso con las cartas bravas, el tanteo del envido y cómo mentir."),
        ("🤖 VS LA COMPUTADORA", "Jugá partidas rápidas en tu celu o PC contra la inteligencia artificial (3 dificultades)."),
        ("👥 CON AMIGOS ONLINE", "Creá tu sala, pasales el link por WhatsApp y jueguen 1v1, en parejas o en tríos."),
        ("🃏 BARAJA CRIOLLA DE 40", "Los 40 naipes dibujados a mano con el estilo litográfico tradicional de pulpería."),
    ]
    
    item_y = feat_y + 75
    for title_k, desc_k in key_features:
        # Título del item en Cinzel Bold
        draw.text((feat_x + 25, item_y), title_k, font=font_lora_bold, fill=(254, 240, 138))
        
        # Descripción en Lora Regular con salto de línea prolijo
        # Dividir el texto en 2 líneas prolijas
        words = desc_k.split(' ')
        line1, line2 = '', ''
        for w in words:
            test_line = (line1 + ' ' + w).strip()
            tb = draw.textbbox((0, 0), test_line, font=font_lora_desc)
            if (tb[2] - tb[0]) < (feat_w - 50) and not line2:
                line1 = test_line
            else:
                line2 = (line2 + ' ' + w).strip()
                
        draw.text((feat_x + 25, item_y + 32), line1, font=font_lora_desc, fill=(214, 211, 209))
        if line2:
            draw.text((feat_x + 25, item_y + 58), line2, font=font_lora_desc, fill=(214, 211, 209))
            
        item_y += 115

    # 7. LLAMADO A LA ACCIÓN (CALL TO ACTION) EN EL PIE
    cta_w = 960
    cta_h = 100
    cta_x = (W - cta_w) // 2
    cta_y = 1690
    
    # Resplandor verde esmeralda
    cta_glow = Image.new('RGBA', (cta_w + 40, cta_h + 40), (0, 0, 0, 0))
    cg_draw = ImageDraw.Draw(cta_glow)
    cg_draw.rounded_rectangle([10, 10, cta_w + 20, cta_h + 20], radius=34, fill=(16, 185, 129, 160))
    cta_glow = cta_glow.filter(ImageFilter.GaussianBlur(18))
    story.paste(cta_glow, (cta_x - 10, cta_y - 10), cta_glow)
    
    # Botón CTA en Cinzel Bold
    draw.rounded_rectangle([cta_x, cta_y, cta_x + cta_w, cta_y + cta_h], radius=28, fill=(4, 120, 87), outline=(52, 211, 153), width=3)
    
    cta_label = "👉 ¡TOCÁ EL LINK Y ENTRÁ A LA MESA!"
    cl_box = draw.textbbox((0, 0), cta_label, font=font_cinzel_cta)
    cl_w = cl_box[2] - cl_box[0]
    draw.text(((W - cl_w) // 2, cta_y + 30), cta_label, font=font_cinzel_cta, fill=(255, 255, 255))
    
    # Subtexto final Lora
    sub_foot = "100% Web Gratis • Sin Descargas • Jugá en el Celular o PC"
    sf_box = draw.textbbox((0, 0), sub_foot, font=font_lora_bold)
    sf_w = sf_box[2] - sf_box[0]
    draw.text(((W - sf_w) // 2, cta_y + 120), sub_foot, font=font_lora_bold, fill=(245, 158, 11))

    output_path = 'public/historia_instagram_truco.png'
    story.save(output_path, quality=95)
    print(f'Historia de Instagram actualizada exitosamente en {output_path}!')

if __name__ == '__main__':
    generate_story()
