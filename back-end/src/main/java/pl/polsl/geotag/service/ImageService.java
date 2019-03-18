package pl.polsl.geotag.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.polsl.geotag.decoder.Base64Decoder;
import pl.polsl.geotag.dto.AllImageOutputDTO;
import pl.polsl.geotag.dto.CreateImageDTO;
import pl.polsl.geotag.dto.ImageOutputDTO;
import pl.polsl.geotag.dto.UpdateImageDTO;
import pl.polsl.geotag.exception.RepositoryException;
import pl.polsl.geotag.model.Image;
import pl.polsl.geotag.repository.ImageRepository;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    public static final int THUMBNAIL_WIDTH = 300;
    public static final int THUMBNAIL_HEIGHT = 200;
    @Autowired
    ImageRepository imageRepository;

//    public Image save(MultipartFile file) {
//        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
//        String contentType = file.getContentType();
//        try {
//            Image image = new Image(file.getBytes(), fileName, contentType, 10, 10);
//
//            return imageRepository.save(image);
//        } catch (IOException e) {
//            throw new RepositoryException("Could not store file " + fileName + ". Please try again!");
//        }
//    }

    public ResponseEntity<?> addImage(final CreateImageDTO createImageDTO) {
        //TODO save latitude & longitude to image
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
        byte[] data = image.getData();

        byte[] thumbnail = convertToThumbnail(data);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(image.getType())) //
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", image.getName())) //
                .body(new ByteArrayResource(thumbnail));
    }

    private byte[] convertToThumbnail(byte[] data) {
        ByteArrayInputStream in = new ByteArrayInputStream(data);
        try {
            BufferedImage img = ImageIO.read(in);
            //TODO scale image by %

            java.awt.Image scaledImage = img.getScaledInstance(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, java.awt.Image.SCALE_SMOOTH);
            BufferedImage imageBuff = new BufferedImage(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, BufferedImage.TYPE_INT_RGB);
            imageBuff.getGraphics().drawImage(scaledImage, 0, 0, new Color(0, 0, 0), null);

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();

            ImageIO.write(imageBuff, "jpg", buffer);

            return buffer.toByteArray();
        } catch (IOException e) {
            throw new RepositoryException("IOException in scale");
        }
    }

    public ResponseEntity<?> getAllImages(String baseUrl) {
        List<ImageOutputDTO> outputDTOList = new ArrayList<>();
        List<Image> imageList = imageRepository.findAll();
        imageList.forEach(image ->
        {
            ImageOutputDTO imageOutputDTO = mapImageToOutput(image, baseUrl);
            outputDTOList.add(imageOutputDTO);
        });
        AllImageOutputDTO response = new AllImageOutputDTO(outputDTOList);
        return ResponseEntity.ok(response);
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
}
