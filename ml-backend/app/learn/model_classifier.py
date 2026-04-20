import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.applications import MobileNetV2

def build_model(num_classes, img_height=224, img_width=224):
    """
    Fungsi untuk membangun arsitektur model klasifikasi.
    Menggunakan MobileNetV2 sebagai pre-trained model (Transfer Learning).
    """
    print("[*] Membangun arsitektur model berbasis MobileNetV2...")
    
    # 1. Muat base model MobileNetV2 (tanpa layer output klasifikasi aslinya)
    base_model = MobileNetV2(
        weights='imagenet', 
        include_top=False, 
        input_shape=(img_height, img_width, 3)
    )
    
    # Freeze base model agar bobot awalnya tidak berubah saat training awal
    base_model.trainable = False 
    
    # 2. Tambahkan custom layer di bagian ujung untuk dataset bencana kita
    x = base_model.output
    x = GlobalAveragePooling2D()(x) # Meratakan fitur
    x = Dense(128, activation='relu')(x) # Hidden layer tambahan
    x = Dropout(0.5)(x) # Mencegah overfitting dengan mematikan 50% neuron secara acak
    
    # 3. Layer Output (sesuaikan jumlah neuron dengan jumlah folder/kelas bencanamu)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    # 4. Gabungkan menjadi satu model utuh
    model = Model(inputs=base_model.input, outputs=predictions)
    
    print(f"[*] Model berhasil dibangun dengan {num_classes} kelas output.")
    
    return model