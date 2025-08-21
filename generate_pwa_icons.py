"""
Générateur d'icônes PWA pour Akuma Budget
Crée automatiquement toutes les tailles d'icônes nécessaires
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_pwa_icon(size, save_path):
    """Crée une icône PWA de la taille spécifiée"""
    # Créer une nouvelle image avec fond dégradé simulé
    img = Image.new('RGB', (size, size), color='#3b82f6')
    draw = ImageDraw.Draw(img)
    
    # Arrière-plan avec dégradé simple (du bleu foncé vers bleu clair)
    for y in range(size):
        # Calcul couleur dégradé
        ratio = y / size
        r = int(59 + (30 * ratio))  # 59 vers 89
        g = int(130 + (20 * ratio))  # 130 vers 150  
        b = int(246 - (20 * ratio))  # 246 vers 226
        color = (r, g, b)
        draw.line([(0, y), (size, y)], fill=color)
    
    # Cercle de fond pour le logo
    circle_size = int(size * 0.7)
    circle_pos = ((size - circle_size) // 2, (size - circle_size) // 2)
    draw.ellipse([circle_pos[0], circle_pos[1], 
                  circle_pos[0] + circle_size, circle_pos[1] + circle_size], 
                 fill='#1e40af', outline='#ffffff', width=max(2, size//50))
    
    try:
        # Essayer d'utiliser une police système
        font_size = max(12, size // 8)
        font = ImageFont.truetype("arial.ttf", font_size)
        font_large = ImageFont.truetype("arial.ttf", font_size * 2)
    except:
        # Police par défaut si arial pas trouvée
        font = ImageFont.load_default()
        font_large = ImageFont.load_default()
    
    # Texte principal "A" pour Akuma
    text = "💰"
    if size >= 72:
        # Pour les grandes tailles, utiliser emoji ou texte
        text_large = "A"
        bbox = draw.textbbox((0, 0), text_large, font=font_large)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2 - size // 10
        
        draw.text((text_x, text_y), text_large, fill='#ffffff', font=font_large)
        
        # Texte "BUDGET" en dessous pour grandes icônes
        if size >= 128:
            small_text = "BUDGET"
            bbox_small = draw.textbbox((0, 0), small_text, font=font)
            small_width = bbox_small[2] - bbox_small[0] 
            small_x = (size - small_width) // 2
            small_y = text_y + text_height + 5
            
            draw.text((small_x, small_y), small_text, fill='#ffffff', font=font)
    
    # Sauvegarder l'icône
    img.save(save_path, 'PNG', quality=95)
    print(f"OK: Icone creee: {save_path} ({size}x{size}px)")

def generate_all_icons():
    """Génère toutes les icônes PWA nécessaires"""
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    icons_dir = "public/icons"
    
    # Créer le dossier s'il n'existe pas
    os.makedirs(icons_dir, exist_ok=True)
    
    print("Generation des icones PWA Akuma Budget...")
    
    for size in sizes:
        filename = f"icon-{size}x{size}.png"
        filepath = os.path.join(icons_dir, filename)
        create_pwa_icon(size, filepath)
    
    # Créer aussi favicon.ico et apple-touch-icon
    create_pwa_icon(32, os.path.join("public", "favicon-32x32.png"))
    create_pwa_icon(180, os.path.join("public", "apple-touch-icon.png"))
    
    print("Toutes les icones PWA ont ete generees avec succes!")
    print("Votre application peut maintenant etre installee comme PWA sur iOS/Android")

if __name__ == "__main__":
    generate_all_icons()