package pl.polsl.geotag.service;

import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.polsl.geotag.decoder.Base64Decoder;
import pl.polsl.geotag.dto.*;
import pl.polsl.geotag.exception.RepositoryException;
import pl.polsl.geotag.model.Image;
import pl.polsl.geotag.repository.ImageRepository;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class ImageService {

    @Autowired
    ImageRepository imageRepository;
    @Autowired
    PythonRunner pythonRunner;

    public ResponseEntity<?> addImage(final CreateImageDTO createImageDTO) {
        byte[] data = Base64Decoder.decodeValue(createImageDTO.getBase64());
        String type = decodeType(createImageDTO.getFileName());
        Image image = new Image(data, createImageDTO.getFileName(), type, createImageDTO.getLatitude(), createImageDTO.getLongitude());
        Image newImage = imageRepository.save(image);
        String response = new JSONObject().put("id", newImage.getId()).toString();
        return ResponseEntity.ok(response);
    }


    public ResponseEntity<?> deleteImage(UUID imageId) {
        imageRepository.deleteById(imageId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseEntity<?> downloadImage(UUID imageId) {
        Image image = getImage(imageId);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(image.getType()))//
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", image.getName()))//
                .body(new ByteArrayResource(image.getData()));
    }

    public ResponseEntity<?> updateImage(final UUID imageId, final UpdateImageDTO updateImageDTO) {
        Image image = getImage(imageId);
        image.setLatitude(updateImageDTO.getLatitude());
        image.setLongitude(updateImageDTO.getLongitude());
        imageRepository.save(image);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseEntity<?> getGeotags(final UUID imageId) {
        Image image = getImage(imageId);
        String response = new JSONObject() //
                .put("latitude", image.getLatitude()) //
                .put("longitude", image.getLongitude()) //
                .toString();
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> downloadThumbnail(UUID imageId) {
        Image image = getImage(imageId);
        byte[] thumbnail = pythonRunner.createThumbnail(imageId.toString());
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(image.getType())) //
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", image.getName())) //
                .body(new ByteArrayResource(thumbnail));
    }

    public ResponseEntity<?> getAllImages(String baseUrl) {
        List<Image> imageList = imageRepository.findAll();
        Map<Double, Map<Double, List<Image>>> map = imageList.stream().collect(Collectors.groupingBy(Image::getLatitude, Collectors.groupingBy(Image::getLongitude)));
        List<AllImageOutputDTO> imageOutputDTOS = new ArrayList<>();
        map.values().forEach(nestedMap ->
                nestedMap.values().forEach(images ->
                        imageOutputDTOS.add(createImageOutputDto(baseUrl, images))));
        SortedImageDTO sortedImageDTOS = new SortedImageDTO(imageOutputDTOS);
        return ResponseEntity.ok().body(sortedImageDTOS);
    }

    private AllImageOutputDTO createImageOutputDto(String baseUrl, List<Image> imageList) {
        List<ImageOutputDTO> outputDTOList = new ArrayList<>();
        imageList.forEach(image -> {
            ImageOutputDTO imageOutputDTO = mapImageToOutput(image, baseUrl);
            outputDTOList.add(imageOutputDTO);
        });
        return new AllImageOutputDTO(outputDTOList);
    }

    private ImageOutputDTO mapImageToOutput(Image image, String baseUrl) {
        ImageOutputDTO imageOutputDTO = new ImageOutputDTO();
        imageOutputDTO.setFileName(image.getName());
        imageOutputDTO.setId(image.getId());
        imageOutputDTO.setLatitude(image.getLatitude());
        imageOutputDTO.setLongitude(image.getLongitude());
        String src = createThumbnailUrl(image.getId(), baseUrl);
        imageOutputDTO.setSrc(src);
        return imageOutputDTO;
    }

    private String createThumbnailUrl(final UUID imageId, final String baseUrl) {
        return String.format("%s/downloads/thumbnail/%s", baseUrl, imageId.toString());
    }

    private Image getImage(final UUID imageId) {
        return imageRepository.findById(imageId).orElseThrow(() -> new RepositoryException(String.format("Can not find file:%s", imageId)));
    }

    private String decodeType(final String source) {
        try {
            String[] parts = source.split("\\.");
            return String.format("image/%s", parts[parts.length - 1]);
        } catch (IndexOutOfBoundsException e) {
            throw new RepositoryException("Invalid file name");
        }
    }

    public ResponseEntity<?> getImagesByCoordinates(double latitude, double longitude, String baseUrl) {
        List<Image> imageList = imageRepository.findAll();
        List<Image> filteredImageList = imageList.stream().filter(image -> image.getLatitude() == latitude && image.getLongitude() == longitude).collect(Collectors.toList());
        AllImageOutputDTO response = createImageOutputDto(baseUrl, filteredImageList);
        return ResponseEntity.ok().body(response);
    }

    public ResponseEntity<?> getImagesByCoordinatesRange(CoordinatesRangeDTO coordinatesRangeDTO, String baseUrl) {
        List<Image> imageList = imageRepository.findAll();
        List<Image> filteredImageList = imageList.stream().filter(filterCoordinates(coordinatesRangeDTO)).collect(Collectors.toList());
        AllImageOutputDTO response = createImageOutputDto(baseUrl, filteredImageList);
        return ResponseEntity.ok().body(response);
    }

    private Predicate<Image> filterCoordinates(CoordinatesRangeDTO coordinatesRangeDTO) {
        return image -> image.getLatitude() >= coordinatesRangeDTO.getMinLatitude() //
                && image.getLatitude() <= coordinatesRangeDTO.getMaxLatitude() //
                && image.getLongitude() >= coordinatesRangeDTO.getMinLongitude() //
                && image.getLongitude() <= coordinatesRangeDTO.getMaxLongitude();
    }

    public ResponseEntity<?> getBase64Image(UUID imageId) {
        Image image = getImage(imageId);
        String base64 = new String(Base64.encodeBase64(image.getData()), StandardCharsets.UTF_8);
        String response = new JSONObject().put("data", base64).toString();

        return ResponseEntity.ok().body(response);
    }
}
