import os
from PIL import Image

def clean_corrupted_images(dataset_dir):
    print(f"[*] Mulai memindai folder {dataset_dir} untuk mencari gambar rusak...")
    hapus_count = 0
    
    # Berjalan menyusuri semua folder dan sub-folder
    for root, dirs, files in os.walk(dataset_dir):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                # Coba buka gambarnya
                img = Image.open(file_path)
                img.verify() # Verifikasi apakah formatnya benar
            except Exception as e:
                # Jika gagal dibuka (rusak/bukan gambar), maka hapus
                print(f"[!] Gambar rusak ditemukan & dihapus: {file_path}")
                os.remove(file_path)
                hapus_count += 1
                
    print(f"[*] Pemindaian selesai! Total {hapus_count} file rusak telah dihapus.")

if __name__ == '__main__':
    # Sesuaikan dengan nama folder datasetmu
    folder_dataset = "../dataset" 
    clean_corrupted_images(folder_dataset)