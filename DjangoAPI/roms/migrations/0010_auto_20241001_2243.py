from django.db import migrations

def add_emuladores(apps, schema_editor):
    Emulador = apps.get_model('roms', 'Emulador')
    emuladores = [
        {'nome': 'snes', 'console': 'Super Nintendo', 'empresa': 'nintendo'},
        {'nome': 'nes', 'console': 'Nintendo Entertainment System', 'empresa': 'nintendo'},
        {'nome': 'gb', 'console': 'Game Boy', 'empresa': 'nintendo'},
        {'nome': 'gbc', 'console': 'Game Boy Color', 'empresa': 'nintendo'},
        {'nome': 'gba', 'console': 'Game Boy Advance', 'empresa': 'nintendo'},
        {'nome': 'n64', 'console': 'Nintendo 64', 'empresa': 'nintendo'},
        {'nome': 'ds', 'console': 'Nintendo DS', 'empresa': 'nintendo'},
        {'nome': 'gc', 'console': 'GameCube', 'empresa': 'nintendo'},
        {'nome': 'ps1', 'console': 'PlayStation', 'empresa': 'sony'},
        {'nome': 'ps2', 'console': 'PlayStation 2', 'empresa': 'sony'},
        {'nome': 'dc', 'console': 'Dreamcast', 'empresa': 'sega'},
        {'nome': 'md', 'console': 'Sega Mega Drive', 'empresa': 'sega'},
    ]

    for emulador in emuladores:
        Emulador.objects.create(nome=emulador['nome'], console=emulador['console'], empresa=emulador['empresa'])
class Migration(migrations.Migration):

    dependencies = [
        ('roms', '0009_emulador_console'), 
    ]

    operations = [
        migrations.RunPython(add_emuladores),
    ]
