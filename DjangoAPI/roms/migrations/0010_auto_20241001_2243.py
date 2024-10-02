from django.db import migrations

def add_emuladores(apps, schema_editor):
    Emulador = apps.get_model('roms', 'Emulador')
    emuladores = [
        {'nome': 'snes', 'console': 'Super Nintendo'},
        {'nome': 'nes', 'console': 'Nintendo Entertainment System'},
        {'nome': 'gb', 'console': 'Game Boy'},
        {'nome': 'gbc', 'console': 'Game Boy Color'},
        {'nome': 'gba', 'console': 'Game Boy Advance'},
        {'nome': 'n64', 'console': 'Nintendo 64'},
        {'nome': 'ds', 'console': 'Nintendo DS'},
        {'nome': 'gc', 'console': 'GameCube'},
        {'nome': 'ps1', 'console': 'PlayStation'},
        {'nome': 'ps2', 'console': 'PlayStation 2'},
        {'nome': 'dc', 'console': 'Dreamcast'},
        {'nome': 'md', 'console': 'Sega Mega Drive'},
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
