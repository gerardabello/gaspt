use std::*;
/*type vector3 = [f32; 3];

struct Camera {
      position: vector3,
      direction: vector3,
      fov: f32
}

struct Material {
      type: str,
      color: vector3,
      emission: vector3
}

struct SimpleObject {
    type: str,
    radius: f32,
    position: vector3,
    material: Material
}

struct Scene {
    enviroment: vector3,
    camera: Camera
}
*/

#[no_mangle]
pub unsafe fn default(mem_start: u32, mem_length: u32) -> u32 {
    // Convert the pointer and length to a `&[u8]`.
    let data : &[u8] = std::slice::from_raw_parts(mem_start as *const u8, mem_length as usize);

    let string : String = match str::from_utf8(data) {
        Ok(s) => private(s.into()),
        Err(_) => "error".into()
    };

    let bytes = string.as_bytes();
    let mem_start_mut : u8 = mem_start as u8;

    for i in 0..(bytes.len()) {
        ptr::write((mem_start_mut + i as u8) as *mut u8, bytes[i] as u8);
    }

    return bytes.len() as u32;
}

fn private(s: String) -> String {
    return format!("Hello {}", s);
}
