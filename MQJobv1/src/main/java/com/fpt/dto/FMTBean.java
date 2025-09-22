/*
 * Created on Jul 7, 2009
 *
 * To change the template for this generated file go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
package com.fpt.dto;

/**
 * @author Tran Van Dung
 *
 * To change the template for this generated type comment go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
public class FMTBean {
		private String check_user;
		private String check_password;
		
		private int currentPage;
	
		/**
		 * @return
		 */
		public String getCheck_password() {
			return check_password;
		}


		/**
		 * @return
		 */
		public String getCheck_user() {
			return check_user;
		}

		/**
		 * @param string
		 */
		public void setCheck_password(String string) {
			check_password = string;
		}

		/**
		 * @param string
		 */
		public void setCheck_user(String string) {
			check_user = string;
		}

		

		/**
		 * @return
		 */
		public int getCurrentPage() {
			return currentPage;
		}

		/**
		 * @param i
		 */
		public void setCurrentPage(int i) {
			currentPage = i;
		}

}
