#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};



fn main() {
    let new_todo = CustomMenuItem::new("new".to_string(), "New ToDo");
    let close = CustomMenuItem::new("quit".to_string(), "Quit");
    let submenu = Submenu::new("File", Menu::new().add_item(new_todo).add_item(close));
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_item(CustomMenuItem::new("hide", "Hide"))
      .add_submenu(submenu);



    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
              "quit" => {
                std::process::exit(0);
              }
              "new" => {
                event.window().emit("new-todo", "").unwrap();
              }
              _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
