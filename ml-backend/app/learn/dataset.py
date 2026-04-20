import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

def prepare_datasets(dataset_dir, batch_size=16, img_height=224, img_width=224):
    """
    Fungsi untuk memuat dataset dari direktori dan membaginya 
    menjadi data training (80%) dan data validasi (20%).
    """
    print(f"[*] Membaca dataset dari folder: {dataset_dir}")
    
    # Pastikan foldernya ada
    if not os.path.exists(dataset_dir):
        raise FileNotFoundError(f"Folder dataset tidak ditemukan di {dataset_dir}")

    # 1. Konfigurasi Augmentasi untuk Data Training
    # Ini membantu memperbanyak variasi gambar agar model lebih tangguh
    train_datagen = ImageDataGenerator(
        rescale=1./255,             # Normalisasi nilai piksel (0-255 menjadi 0-1)
        rotation_range=20,          # Putar gambar maksimal 20 derajat
        width_shift_range=0.2,      # Geser horizontal
        height_shift_range=0.2,     # Geser vertikal
        shear_range=0.2,            # Distorsi bentuk
        zoom_range=0.2,             # Zoom in/out
        horizontal_flip=True,       # Balik gambar secara horizontal (kiri-kanan)
        validation_split=0.2        # Sisihkan 20% data untuk validasi/testing
    )

    # 2. Memuat Data Training (80%)
    print("[*] Menyiapkan Data Training...")
    train_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=(img_height, img_width), # Ukuran gambar diseragamkan (misal 224x224)
        batch_size=batch_size,
        class_mode='categorical',            # Karena ada lebih dari 2 kelas bencana
        subset='training'                    # Ambil bagian training
    )

    # 3. Memuat Data Validasi (20%)
    # Untuk validasi, kita HANYA melakukan rescale (tidak perlu di-augmentasi/diputar-putar)
    print("[*] Menyiapkan Data Validasi...")
    validation_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation'                  # Ambil bagian validasi
    )
    
    # Menampilkan kelas yang terdeteksi (opsional, untuk memastikan folder terbaca)
    classes = train_generator.class_indices
    print(f"[*] Kelas bencana yang terdeteksi: {classes}")

    return train_generator, validation_generator