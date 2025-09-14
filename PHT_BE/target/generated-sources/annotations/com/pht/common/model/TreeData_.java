package com.pht.common.model;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.MappedSuperclassType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.List;

@StaticMetamodel(TreeData.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class TreeData_ {

	
	/**
	 * @see com.pht.common.model.TreeData#getLevel
	 **/
	public static volatile SingularAttribute<TreeData, Integer> level;
	
	/**
	 * @see com.pht.common.model.TreeData#isHasChild
	 **/
	public static volatile SingularAttribute<TreeData, Boolean> hasChild;
	
	/**
	 * @see com.pht.common.model.TreeData#isRoot
	 **/
	public static volatile SingularAttribute<TreeData, Boolean> root;
	
	/**
	 * @see com.pht.common.model.TreeData#getParentNodeId
	 **/
	public static volatile SingularAttribute<TreeData, Object> parentNodeId;
	
	/**
	 * @see com.pht.common.model.TreeData
	 **/
	public static volatile MappedSuperclassType<TreeData> class_;
	
	/**
	 * @see com.pht.common.model.TreeData#getChilds
	 **/
	public static volatile SingularAttribute<TreeData, List<? extends TreeData<?>>> childs;
	
	/**
	 * @see com.pht.common.model.TreeData#getNodeId
	 **/
	public static volatile SingularAttribute<TreeData, Object> nodeId;

	public static final String LEVEL = "level";
	public static final String HAS_CHILD = "hasChild";
	public static final String ROOT = "root";
	public static final String PARENT_NODE_ID = "parentNodeId";
	public static final String CHILDS = "childs";
	public static final String NODE_ID = "nodeId";

}

