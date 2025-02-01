import tkinter as tk
from tkinter import ttk, filedialog, font, messagebox
import backend
import sv_ttk
import darkdetect
import ctypes

class FGDApp:
    def __init__(self, root):
        # Set DPI awareness and scaling factor
        ctypes.windll.shcore.SetProcessDpiAwareness(1)
        scaleFactor = ctypes.windll.shcore.GetScaleFactorForDevice(0) / 100

        self.root = root
        sv_ttk.set_theme("dark" if darkdetect.isDark() else "light")
        self.root.title("FGD to CSV Converter")
        self.root.geometry(f"{int(750 * scaleFactor)}x{int(500 * scaleFactor)}")

        # Define custom font
        custom_font = font.Font(family="Segoe UI", size=12)

        # Create a style and configure the font for ttk widgets
        style = ttk.Style()
        style.configure("TLabel", font=custom_font)
        style.configure("TButton", font=custom_font)
        style.configure("TRadiobutton", font=custom_font)
        style.configure("TEntry", font=custom_font)

        self.frame = ttk.Frame(root)
        self.frame.pack(pady=20)

        self.label = ttk.Label(self.frame, text="Select FGD File:")
        self.label.grid(row=0, column=0, columnspan=4, padx=10, pady=10)

        self.file_path_entry = ttk.Entry(self.frame, width=50)
        self.file_path_entry.grid(row=1, column=0, columnspan=3, padx=10, pady=10)

        self.browse_button = ttk.Button(self.frame, text="Browse", command=self.browse_file)
        self.browse_button.grid(row=1, column=3, padx=10, pady=10)

        self.current_file_label = ttk.Label(self.frame, text="No file selected")
        self.current_file_label.grid(row=2, column=0, columnspan=4, pady=10)

        # Add Visualize Options label
        self.visualize_label = ttk.Label(self.frame, text="Visualizer Options:")
        self.visualize_label.grid(row=3, column=0, columnspan=4, pady=(20, 10))

        self.class_type = tk.StringVar(value="All")

        self.all_radio = ttk.Radiobutton(self.frame, text="All", variable=self.class_type, value="All")
        self.all_radio.grid(row=4, column=0, padx=20, pady=10)

        self.solid_radio = ttk.Radiobutton(self.frame, text="Solid", variable=self.class_type, value="Solid")
        self.solid_radio.grid(row=4, column=1, padx=20, pady=10)

        self.point_radio = ttk.Radiobutton(self.frame, text="Point", variable=self.class_type, value="Point")
        self.point_radio.grid(row=4, column=2, padx=20, pady=10)

        self.base_radio = ttk.Radiobutton(self.frame, text="Base", variable=self.class_type, value="Base")
        self.base_radio.grid(row=4, column=3, padx=20, pady=10)

        self.visualize_button = ttk.Button(self.frame, text="Visualize Data", command=self.visualize_data)
        self.visualize_button.grid(row=5, column=0, columnspan=4, pady=10)

        self.create_csv_button = ttk.Button(self.frame, text="Create CSV", command=self.create_csv)
        self.create_csv_button.grid(row=6, column=0, columnspan=4, pady=10)

        self.note_label = ttk.Label(self.frame, text="Note: The Entity counter is an approximation.")
        self.note_label.grid(row=7, column=0, columnspan=4, pady=(10, 0))

    def browse_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("FGD files", "*.fgd")])
        if file_path:
            self.file_path_entry.delete(0, tk.END)
            self.file_path_entry.insert(0, file_path)
            self.current_file_label.config(text=f"Current file: {file_path}")

    from tkinter import messagebox

    def create_csv(self):
        file_path = self.file_path_entry.get()
        if file_path:
            solid_details, point_details, base_details = backend.parse_fgd(file_path)
            detail_file = "details.csv"
            backend.write_details_to_csv(solid_details, point_details, base_details, detail_file)
            messagebox.showinfo("Success", f"CSV file has been created as: {detail_file}")
        else:
            messagebox.showwarning("Warning", "No file selected. Please select a file to create CSV.")

    def visualize_data(self):
        file_path = self.file_path_entry.get()
        if file_path:
            solid_details, point_details, base_details = backend.parse_fgd(file_path)

            class_type = self.class_type.get()
            if class_type == "Solid":
                self.create_window("Solid Classes", f"Count: {len(solid_details)}\n" + "\n".join(solid_details))
            elif class_type == "Point":
                self.create_window("Point Classes", f"Count: {len(point_details)}\n" + "\n".join(point_details))
            elif class_type == "Base":
                self.create_window("Base Classes", f"Count: {len(base_details)}\n" + "\n".join(base_details))
            else:
                self.create_window("Solid Classes", f"Count: {len(solid_details)}\n" + "\n".join(solid_details))
                self.create_window("Point Classes", f"Count: {len(point_details)}\n" + "\n".join(point_details))
                self.create_window("Base Classes", f"Count: {len(base_details)}\n" + "\n".join(base_details))

    def create_window(self, title, content):
        window = tk.Toplevel(self.root)
        window.title(title)

        frame = ttk.Frame(window)
        frame.pack(fill=tk.BOTH, expand=True)

        search_frame = ttk.Frame(frame)
        search_frame.pack(fill=tk.X, padx=10, pady=5)

        search_label = ttk.Label(search_frame, text="Search:")
        search_label.pack(side=tk.LEFT, padx=5)

        search_entry = ttk.Entry(search_frame)
        search_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)

        search_button = ttk.Button(search_frame, text="Search",
                                   command=lambda: self.search_entity(search_entry.get(), content, result_label))
        search_button.pack(side=tk.LEFT, padx=5)

        text_frame = ttk.Frame(frame)
        text_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        scrollbar = ttk.Scrollbar(text_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        result_label = tk.Text(text_frame, wrap=tk.WORD, yscrollcommand=scrollbar.set, font=("Segoe UI", 12))
        result_label.insert(tk.END, content)
        result_label.config(state=tk.DISABLED)
        result_label.pack(fill=tk.BOTH, expand=True)

        scrollbar.config(command=result_label.yview)

    def search_entity(self, query, content, result_label):
        lines = content.split('\n')
        filtered_lines = [line for line in lines if query.lower() in line.lower()]
        result_label.config(state=tk.NORMAL)
        result_label.delete(1.0, tk.END)
        result_label.insert(tk.END, "\n".join(filtered_lines))
        result_label.config(state=tk.DISABLED)

if __name__ == "__main__":
    root = tk.Tk()
    app = FGDApp(root)
    root.mainloop()