Set-Location -Path "c:\Users\esteb\OneDrive\Desktop\Pagina Bomberos\assets"

# Delete Test.png
if (Test-Path "Test.png") { Remove-Item -Path "Test.png" -Force }

# Create directories
New-Item -ItemType Directory -Force -Path "Extintores_Assets"
New-Item -ItemType Directory -Force -Path "Empresas_Assets"
New-Item -ItemType Directory -Force -Path "Servicios_Assets"
New-Item -ItemType Directory -Force -Path "Botiquines_Camillas_Assets"
New-Item -ItemType Directory -Force -Path "Proteccion_Personal_Assets"
New-Item -ItemType Directory -Force -Path "Senalizacion_Assets"
New-Item -ItemType Directory -Force -Path "Kits_Derrames_Assets"
New-Item -ItemType Directory -Force -Path "Bombero_Assets"

# Move images
Move-Item -Path "Exintor*.jpg" -Destination "Extintores_Assets" -ErrorAction SilentlyContinue
Move-Item -Path "Extintor*.jpg", "Extintor*.jpeg", "Extintor*.png" -Destination "Extintores_Assets" -ErrorAction SilentlyContinue
Move-Item -Path "Empresa*.png" -Destination "Empresas_Assets" -ErrorAction SilentlyContinue
Move-Item -Path "Análisis de Riesgos Laborales.jpeg", "Asesorias.jpeg", "Cumplimiento Normativo en Seguridad.jpeg", "Pintura para Extintores.jpeg", "Pruebas Hidrostáticas.jpeg", "Redes contra incendio.jpeg", "Sistema de detencíon temprana.jpeg" -Destination "Servicios_Assets" -ErrorAction SilentlyContinue
Move-Item -Path "Botiquines.jpg", "Camillas.jpg", "Inmovilizadores.jpg" -Destination "Botiquines_Camillas_Assets" -ErrorAction SilentlyContinue
Move-Item -Path "Cascos Industriales.jpg", "Gafas.jpg", "Guantes.jpg", "Impermeables.jpg", "Tapabocas industriales.jpg" -Destination "Proteccion_Personal_Assets" -ErrorAction SilentlyContinue
Move-Item -Path "Señalizacion*.jpg" -Destination "Senalizacion_Assets" -ErrorAction SilentlyContinue
Move-Item -Path "Kit derrames*.jpg" -Destination "Kits_Derrames_Assets" -ErrorAction SilentlyContinue
Move-Item -Path "*Bombero*.png" -Destination "Bombero_Assets" -ErrorAction SilentlyContinue
