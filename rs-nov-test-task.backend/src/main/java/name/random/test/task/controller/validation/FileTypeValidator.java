package name.random.test.task.controller.validation;

import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;

public class FileTypeValidator implements ConstraintValidator<FileFormat, MultipartFile> {

    private static final List<String> contentTypes = Arrays.asList("image/png", "image/jpeg");


    @Override
    public void initialize(FileFormat constraintAnnotation) {

    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext constraintValidatorContext) {
        String filetype = file.getContentType();

        return contentTypes.contains(filetype);
    }

}
