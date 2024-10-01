from django.db import migrations

def add_emulators(apps, schema_editor):
    Emulador = apps.get_model('roms', 'Emulador')
    emuladores = [
        'RetroArch',
        'PCSX2',
        'Dolphin',
        'PPSSPP',
        'Citra',
        'Yuzu',
        'ePSXe',
        'Project64',
        'SNES9x',
        'Nestopia',
        'MAME',
        'VisualBoyAdvance',
    ]
    for emulador in emuladores:
        Emulador.objects.create(nome=emulador)

class Migration(migrations.Migration):

    dependencies = [
        ('roms', '0007_auto_20241001_1654'),  # Substitua pela migration anterior
    ]

    operations = [
        migrations.RunPython(add_emulators),
    ]
