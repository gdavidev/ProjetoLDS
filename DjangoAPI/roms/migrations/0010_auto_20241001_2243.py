from django.db import migrations

def add_emuladores(apps, schema_editor):
    Emulador = apps.get_model('roms', 'Emulador')
    emuladores = [
        {'emulador': 'snes', 'console': 'Super Nintendo'},
        {'emulador': 'nes', 'console': 'Nintendo Entertainment System'},
        {'emulador': 'gb', 'console': 'Game Boy'},
        {'emulador': 'gbc', 'console': 'Game Boy Color'},
        {'emulador': 'gba', 'console': 'Game Boy Advance'},
        {'emulador': 'n64', 'console': 'Nintendo 64'},
        {'emulador': 'ds', 'console': 'Nintendo DS'},
        {'emauldor': 'gc', 'console': 'GameCube'},
        {'emulador': 'ps1', 'console': 'PlayStation'},
        {'emulador': 'ps2', 'console': 'PlayStation 2'},
        {'emulador': 'dc', 'console': 'Dreamcast'},
        {'emulador': 'md', 'console': 'Sega Mega Drive'},
    ]

    for emulador in emuladores:
        Emulador.objects.create(nome=emulador)

class Migration(migrations.Migration):

    dependencies = [
        ('roms', '0009_emulador_console'), 
    ]

    operations = [
        migrations.RunPython(add_emuladores),
    ]
