package name.random.test.task.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;
import name.random.test.task.domain.view.Views;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class Image {

    @Id
    @JsonView(Views.ImageInfo.class)
    @JsonProperty("id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonView(Views.ImageInfo.class)
    @JsonProperty("name")
    private String filename;

    private String fileType;

    @JsonProperty("rotation_speed")
    @JsonView(Views.ImageInfo.class)
    private Integer rotationSpeed;

    @JsonProperty("manual_camera_control")
    @JsonView(Views.ImageInfo.class)
    private Boolean enableManualRotation;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonProperty("creation_time")
    @JsonView(Views.ImageInfo.class)
    private LocalDateTime loadTime;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @JsonIgnore
    private byte[] data;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @JsonIgnore
    private byte[] previewPic;

    @JsonProperty("preview")
    @JsonView(Views.ImageInfo.class)
    private String generatePreviewLink() {
        return ServletUriComponentsBuilder/*.fromCurrentContextPath()*/.newInstance().scheme("http").host("91.103.252.69")
                .pathSegment("images")
                .pathSegment(this.getId().toString())
                .pathSegment("preview")
                .toUriString();
    }

    @JsonProperty("source")
    @JsonView(Views.ImageInfo.class)
    private String generateSourceLink() {
        return ServletUriComponentsBuilder/*.fromCurrentContextPath()*/.newInstance().scheme("http").host("91.103.252.69")
                .pathSegment("images")
                .pathSegment(this.getId().toString())
                .pathSegment("source")
                .toUriString();
    }
}
