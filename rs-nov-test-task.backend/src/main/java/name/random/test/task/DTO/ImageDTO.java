package name.random.test.task.DTO;

import lombok.Data;
import name.random.test.task.controller.validation.FileFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.GroupSequence;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
public class ImageDTO {

    @NotNull
    @NotEmpty(message = "File must not to be empty", groups = FirstStep.class)
    @FileFormat(message = "Invalid file format",groups = SecondStep.class)
    private MultipartFile file;

    @NotEmpty(message = "The name must not be empty")
    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9 ]{3,60}$", message = "Invalid name format")
    private String name;

    @NotNull
    private Boolean enableManualRotation;

    @NotNull
    private Integer rotationSpeed;

    @GroupSequence({FirstStep.class, SecondStep.class})
    public interface OrderedChecks  {}

    interface FirstStep {}
    interface SecondStep {}

}
