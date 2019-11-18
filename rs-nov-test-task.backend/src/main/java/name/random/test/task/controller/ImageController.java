package name.random.test.task.controller;

import com.fasterxml.jackson.annotation.JsonView;
import name.random.test.task.DTO.ImageDTO;
import name.random.test.task.domain.Image;
import name.random.test.task.domain.view.Views;
import name.random.test.task.service.ImageService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
public class ImageController {

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @RequestMapping(
            value = "/images",
            method = RequestMethod.POST,
            consumes = {"multipart/form-data"}
    )
    public ResponseEntity<String> uploadImage(
            @ModelAttribute @Validated ImageDTO imageDTO,
            @RequestParam String previewImg,
            BindingResult result) throws BindException {
        if(result.hasErrors()) {
            throw new BindException(result);
        }

        byte[] imageByte = Base64.decodeBase64(previewImg);
        Image image = imageService.storeImage(imageDTO, imageByte);

        String downloadLink = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/image/")
                .path(image.getId().toString())
                .toUriString();
        return new ResponseEntity<>(downloadLink, HttpStatus.CREATED);
    }

    @JsonView(Views.ImageInfo.class)
    @RequestMapping(
            value = "/images",
            method = RequestMethod.GET)
    public ResponseEntity<List> getListOfImages() {
        List<Image> images = imageService.getAllImages();
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .body(images);
    }

    @JsonView(Views.ImageInfo.class)
    @RequestMapping(
            value = "/images/{id}",
            method = RequestMethod.GET)
    public ResponseEntity<Image> getImage(@PathVariable Long id) {
        Image image = imageService.getImage(id);

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .body(image);
    }

    @RequestMapping(
            value = "/images/{id}/source",
            method = RequestMethod.GET)
    public ResponseEntity<Resource> getSourceImage(@PathVariable Long id) {
        Image image = imageService.getImage(id);

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(image.getFileType()))
                .body(new ByteArrayResource(image.getData()));
    }

    @RequestMapping(
            value = "/images/{id}/preview",
            method = RequestMethod.GET)
    public ResponseEntity<Resource> getImagePreview(@PathVariable Long id) {
        Image image = imageService.getImage(id);

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(new ByteArrayResource(image.getPreviewPic()));
    }


}
