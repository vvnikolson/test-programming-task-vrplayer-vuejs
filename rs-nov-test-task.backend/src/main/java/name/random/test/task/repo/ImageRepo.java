package name.random.test.task.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import name.random.test.task.domain.Image;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepo extends JpaRepository<Image, Long> {

    Optional<List<Image>> findAllByOrderByIdDesc();
}

