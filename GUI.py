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

            self.create_window("Solid Classes", f"Count: {len(solid_details)}\n" + "\n".join(solid_details))
            self.create_window("Point Classes", f"Count: {len(point_details)}\n" + "\n".join(point_details))
            self.create_window("Base Classes", f"Count: {len(base_details)}\n" + "\n".join(base_details))

    def create_window(self, title, content):
        window = tk.Toplevel(self.root)
        window.title(title)

        frame = ttk.Frame(window)
        frame.pack(fill=tk.BOTH, expand=True)

        canvas = tk.Canvas(frame)
        scrollbar = ttk.Scrollbar(frame, orient=tk.VERTICAL, command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(
                scrollregion=canvas.bbox("all")
            )
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        label = ttk.Label(scrollable_frame, text=content, wraplength=400)
        label.pack(padx=10, pady=10)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

if __name__ == "__main__":
    root = tk.Tk()
    app = FGDApp(root)
    root.mainloop()