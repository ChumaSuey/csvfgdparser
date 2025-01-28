import tkinter as tk
from tkinter import ttk, filedialog
import backend
import sv_ttk
import darkdetect
import pywinstyles
import sys

def apply_theme_to_titlebar(root):
    version = sys.getwindowsversion()

    if version.major == 10 and version.build >= 22000:
        # Set the title bar color to the background color on Windows 11 for better appearance
        pywinstyles.change_header_color(root, "#1c1c1c" if sv_ttk.get_theme() == "dark" else "#fafafa")
    elif version.major == 10:
        pywinstyles.apply_style(root, "dark" if sv_ttk.get_theme() == "dark" else "normal")

        # A hacky way to update the title bar's color on Windows 10 (it doesn't update instantly like on Windows 11)
        root.wm_attributes("-alpha", 0.99)
        root.wm_attributes("-alpha", 1)

class FGDApp:
    def __init__(self, root):
        self.root = root
        sv_ttk.set_theme("dark" if darkdetect.isDark() else "light")
        self.root.title("FGD to CSV Converter")

        self.frame = ttk.Frame(root)
        self.frame.pack(pady=20)

        self.label = ttk.Label(self.frame, text="Select FGD File:")
        self.label.grid(row=0, column=0, padx=10, pady=10)

        self.file_path_entry = ttk.Entry(self.frame, width=50)
        self.file_path_entry.grid(row=0, column=1, padx=10, pady=10)

        self.browse_button = ttk.Button(self.frame, text="Browse", command=self.browse_file)
        self.browse_button.grid(row=0, column=2, padx=10, pady=10)

        self.current_file_label = ttk.Label(self.frame, text="No file selected")
        self.current_file_label.grid(row=1, column=0, columnspan=3, pady=10)

        self.create_csv_button = ttk.Button(self.frame, text="Create CSV", command=self.create_csv)
        self.create_csv_button.grid(row=2, column=0, columnspan=3, pady=10)

        self.visualize_button = ttk.Button(self.frame, text="Visualize Data", command=self.visualize_data)
        self.visualize_button.grid(row=3, column=0, columnspan=3, pady=10)

    def browse_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("FGD files", "*.fgd")])
        if file_path:
            self.file_path_entry.delete(0, tk.END)
            self.file_path_entry.insert(0, file_path)
            self.current_file_label.config(text=f"Current file: {file_path}")

    def create_csv(self):
        file_path = self.file_path_entry.get()
        if file_path:
            solid_details, point_details, base_details = backend.parse_fgd(file_path)
            backend.write_details_to_csv(solid_details, point_details, base_details, "details.csv")

    def visualize_data(self):
        file_path = self.file_path_entry.get()
        if file_path:
            solid_details, point_details, base_details = backend.parse_fgd(file_path)

            solid_count = (len(solid_details) + 1) // 2 if len(solid_details) % 2 != 0 else len(solid_details) // 2
            point_count = ((len(point_details) + 1) // 2 if len(point_details) % 2 != 0 else len(
                point_details) // 2) + 1
            base_count = (len(base_details) + 1) // 2 if len(base_details) % 2 != 0 else len(base_details) // 2

            self.create_window("Solid Classes", f"Count: {solid_count}\n" + "\n".join(solid_details))
            self.create_window("Point Classes", f"Count: {point_count}\n" + "\n".join(point_details))
            self.create_window("Base Classes", f"Count: {base_count}\n" + "\n".join(base_details))

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

        result_label = tk.Text(text_frame, wrap=tk.WORD, yscrollcommand=scrollbar.set, font=("Segoe UI", 10))
        result_label.insert(tk.END, content)
        result_label.config(state=tk.DISABLED)
        result_label.pack(fill=tk.BOTH, expand=True)

        scrollbar.config(command=result_label.yview)

    def search_entity(self, query, content, result_label):
        lines = content.split('\n')
        filtered_lines = [line for line in lines if query.lower() in line.lower()]
        result_label.config(text="\n".join(filtered_lines))

if __name__ == "__main__":
    root = tk.Tk()
    app = FGDApp(root)
    root.mainloop()