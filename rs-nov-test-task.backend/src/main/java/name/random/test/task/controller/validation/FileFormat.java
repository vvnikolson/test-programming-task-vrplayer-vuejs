package name.random.test.task.controller.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


@Target({ElementType.TYPE, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = FileTypeValidator.class)
public @interface FileFormat {
    String message() default "Invalid fileformat";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
