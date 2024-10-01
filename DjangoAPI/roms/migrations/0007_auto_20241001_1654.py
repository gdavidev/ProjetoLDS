from django.db import migrations

def add_game_categories(apps, schema_editor):
    Categoria_Jogo = apps.get_model('roms', 'Categoria_Jogo')
    categorias = [
        'Ação',
        'Aventura',
        'RPG',
        'Esportes',
        'Estratégia',
        'Corrida',
        'Simulação',
        'Puzzle',
        'Terror',
        'FPS',
        'MOBA',
        'MMORPG',
    ]
    for categoria in categorias:
        Categoria_Jogo.objects.create(nome=categoria)

class Migration(migrations.Migration):

    dependencies = [
        ('roms', '0006_auto_20241001_1645'), 
    ]

    operations = [
        migrations.RunPython(add_game_categories),
    ]
