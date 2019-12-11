package pl.polsl.geotag.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.polsl.geotag.dto.CoordinatesRangeDTO;
import pl.polsl.geotag.dto.CreateImageDTO;
import pl.polsl.geotag.dto.UpdateImageDTO;
import pl.polsl.geotag.service.ImageService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.UUID;
/**
 * Main REST Controller.
 */
@RequestMapping("/api")
@RestController
public class RESTController {

    @Autowired
    private ImageService imageService;

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

    @GetMapping("/base64/{image_id}")
    public ResponseEntity<?> getBase64Image(@PathVariable(value = "image_id") UUID imageId) {
        return imageService.getBase64Image(imageId);
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
        String baseUrl = getBaseUrl(request);

        return imageService.getAllImages(baseUrl);
    }

    @GetMapping("/geotag/coordinates")
    public ResponseEntity<?> getImagesByCoordinates(HttpServletRequest request, @NotNull @RequestParam double latitude, @NotNull @RequestParam double longitude) {
        String baseUrl = getBaseUrl(request);

        return imageService.getImagesByCoordinates(latitude, longitude, baseUrl);
    }

    @GetMapping("/geotag/coordinates/range")
    public ResponseEntity<?> getImagesByCoordinatesRange(HttpServletRequest request, @NotNull @RequestParam double min_latitude, @NotNull @RequestParam double max_latitude, @NotNull @RequestParam double min_longitude, @NotNull @RequestParam double max_longitude) {
        String baseUrl = getBaseUrl(request);

        CoordinatesRangeDTO coordinatesRangeDTO = new CoordinatesRangeDTO(min_latitude, max_latitude, min_longitude, max_longitude);
        return imageService.getImagesByCoordinatesRange(coordinatesRangeDTO, baseUrl);
    }

    private String getBaseUrl(HttpServletRequest request) {
        return String.format("%s://%s:%d/api", request.getScheme(), request.getServerName(), request.getServerPort());
    }

}
