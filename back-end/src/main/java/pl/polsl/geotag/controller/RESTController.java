package pl.polsl.geotag.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.polsl.geotag.dto.CreateImageDTO;
import pl.polsl.geotag.dto.UpdateImageDTO;
import pl.polsl.geotag.service.ImageService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.UUID;

@RequestMapping("/api")
@RestController
public class RESTController {

    @Autowired
    private ImageService imageService;

//    @PostMapping("/image")
//    public ResponseEntity<String> createImage(@RequestParam("file") MultipartFile file) {
//        Image savedFile = imageService.save(file);
//
//        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/download/").path(savedFile.getId().toString()).toUriString();
//
//        return ResponseEntity.ok(fileDownloadUri);
//    }

    @PostMapping("/geotag")
    public ResponseEntity<?> addImage(@Valid @RequestBody CreateImageDTO createImageDto) {
        return imageService.addImage(createImageDto);
    }

    @DeleteMapping("/geotag/{image_id}")
    public ResponseEntity<?> deleteImage(@PathVariable(value = "image_id") UUID imageId) {
        return imageService.deleteImage(imageId);
    }

    @GetMapping("/downloads/{image_id}")
    public ResponseEntity<?> downloadImage(@PathVariable(value = "image_id") UUID imageId) {
        return imageService.downloadImage(imageId);
    }

    @PutMapping("/geotag/{image_id}")
    public ResponseEntity<?> updateImage(@PathVariable(value = "image_id") UUID imageId, @Valid @RequestBody UpdateImageDTO updateImageDTO) {
        return imageService.updateImage(imageId, updateImageDTO);
    }

    @GetMapping("/geotag/localization/{image_id}")
    public ResponseEntity<?> getGeotags(@PathVariable(value = "image_id") UUID imageId) {
        return imageService.getGeotags(imageId);
    }

    @GetMapping("/downloads/thumbnail/{image_id}")
    public ResponseEntity<?> downloadThumbnail(@PathVariable(value = "image_id") UUID imageId) {
        return imageService.downloadThumbnail(imageId);
    }

    @GetMapping("/geotag")
    public ResponseEntity<?> getAllImages(HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d/api",request.getScheme(),  request.getServerName(), request.getServerPort());

        return imageService.getAllImages(baseUrl);
    }
}
