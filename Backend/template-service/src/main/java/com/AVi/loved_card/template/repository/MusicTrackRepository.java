package com.AVi.loved_card.template.repository;

import com.AVi.loved_card.template.entity.MusicTrack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** JPA thư viện nhạc — chỉ query track {@code active}. */
public interface MusicTrackRepository extends JpaRepository<MusicTrack, UUID> {

    List<MusicTrack> findByActiveTrueOrderByTitleAsc();

    List<MusicTrack> findByActiveTrueAndGenreOrderByTitleAsc(String genre);
}
