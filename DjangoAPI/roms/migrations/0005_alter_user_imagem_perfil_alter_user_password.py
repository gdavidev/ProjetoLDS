# Generated by Django 4.2.15 on 2024-08-27 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("roms", "0004_user_admin"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="imagem_perfil",
            field=models.ImageField(upload_to="img-perfil/"),
        ),
        migrations.AlterField(
            model_name="user",
            name="password",
            field=models.CharField(max_length=128),
        ),
    ]
