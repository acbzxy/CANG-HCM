package com.fpt.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fpt.entity.TcsThamSo;

@Repository
public interface TcsSystemParamRepository extends JpaRepository<TcsThamSo, String> {
	@Query("SELECT t FROM TcsThamSo t ORDER BY t.sapXep DESC")
	List<TcsThamSo> reads();
}
