package name.random.test.task.service;

import name.random.test.task.repo.ImageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import name.random.test.task.DTO.ImageDTO;
import name.random.test.task.domain.Image;
import name.random.test.task.exception.ImageNotFoundException;
import name.random.test.task.exception.ImageStorageException;

import javax.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImageService {

    private final ImageRepo imageRepo;

    @Autowired
    public ImageService(ImageRepo imageRepo) {
        this.imageRepo = imageRepo;
    }

    public Image storeImage(ImageDTO imageDTO, byte[] previewImg) {

        String filename = StringUtils.cleanPath(imageDTO.getFile().getOriginalFilename());

        Image image = new Image();
        try {
            image.setEnableManualRotation(imageDTO.getEnableManualRotation());
            image.setPreviewPic(previewImg);
            image.setRotationSpeed(imageDTO.getRotationSpeed());
            image.setData(imageDTO.getFile().getBytes());
            image.setFilename(imageDTO.getName());
            image.setFileType(imageDTO.getFile().getContentType());
            image.setLoadTime(LocalDateTime.now());
            return imageRepo.save(image);
        } catch (IOException e) {
            throw new ImageStorageException("Can't upload file " + filename + ". Please try again.");
        }
    }

    public Image getImage(Long id) {
        return imageRepo.findById(id).orElseThrow(() -> new ImageNotFoundException("Image not found"));
    }
    @Transactional
    public List<Image> getAllImages() {
        return imageRepo.findAllByOrderByIdDesc().orElse(null);
    }

}
